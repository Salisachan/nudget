import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import TransactionCard from '../components/TransactionCard'
import Navbar from '../components/Navbar'

function Chat() {
    const [input, setInput] = useState('')
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const bottomRef = useRef(null)
    const navigate = useNavigate()

    // fetch last 10 transactions on load
    useEffect(() => {
        const fetchRecent = async () => {
            try {
                const res = await api.get('/transactions?limit=10')
                const cards = res.data.map(t => ({ type: 'card', transaction: t }))
                setMessages(cards)
            } catch (err) {
                console.error(err)
            }
        }
        fetchRecent()
    }, [])

    // auto scroll to bottom
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleSend = async () => {
        if (!input.trim()) return

        // add user bubble immediately
        const userMessage = { type: 'user', text: input }
        setMessages(prev => [...prev, userMessage])
        setInput('')
        setLoading(true)

        try {
            const res = await api.post('/transactions/parse', { input })
            const cardMessage = { type: 'card', transaction: res.data.transaction }
            setMessages(prev => [...prev, cardMessage])
        } catch (err) {
            const errorMessage = { type: 'error', text: 'Could not parse transaction. Please try again.' }
            setMessages(prev => [...prev, errorMessage])
        } finally {
            setLoading(false)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSend()
    }

    return (
        <div>
            <Navbar />
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>
                        {msg.type === 'user' && (
                            <div style={{ textAlign: 'right' }}>
                                <p>{msg.text}</p>
                            </div>
                        )}
                        {msg.type === 'card' && (
                            <TransactionCard transaction={msg.transaction} />
                        )}
                        {msg.type === 'error' && (
                            <div>
                                <p>{msg.text}</p>
                            </div>
                        )}
                    </div>
                ))}
                {loading && <p>Parsing...</p>}
                <div ref={bottomRef} />
            </div>
            <div>
                <input
                    type="text"
                    placeholder="Type a transaction... e.g. coffee 6 bucks"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button onClick={handleSend} disabled={loading}>Send</button>
            </div>
        </div>
    )
}

export default Chat