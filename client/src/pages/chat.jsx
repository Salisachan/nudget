import { useState, useEffect, useRef } from 'react'
import api from '../api'
import TransactionCard from '../components/TransactionCard'
import Navbar from '../components/Navbar'
import useTransactions from '../hooks/useTransactions'

function Chat() {
    const [input, setInput] = useState('')
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const bottomRef = useRef(null)
    const { addTransaction, removeTransaction } = useTransactions()

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

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleSend = async () => {
        if (!input.trim()) return

        const userMessage = { type: 'user', text: input }
        setMessages(prev => [...prev, userMessage])
        setInput('')
        setLoading(true)

        try {
            const res = await api.post('/transactions/parse', { input })
            if (res.data.responseType === 'transaction') {
                const transaction = res.data.transaction
                addTransaction(transaction)
                const cardMessage = { type: 'card', transaction }
                setMessages(prev => [...prev, cardMessage])
            } else {
                const answerMessage = { type: 'answer', text: res.data.answer }
                setMessages(prev => [...prev, answerMessage])
            }
        } catch (err) {
            const errorMessage = { type: 'error', text: 'Could not process your input. Please try again.' }
            setMessages(prev => [...prev, errorMessage])
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = (id) => {
        removeTransaction(id)
        setMessages(prev => prev.filter(msg => msg.transaction?._id !== id))
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSend()
    }

    return (
        <div className="d-flex flex-column vh-100 bg-nudget-light">
            <Navbar />

            {/* Messages area */}
            <div className="flex-grow-1 overflow-auto px-3 py-4">
                <div className="container" style={{ maxWidth: '700px' }}>
                    {messages.length === 0 && (
                        <div className="text-center text-muted mt-5">
                            <p className="fs-5">👋 Start logging your money!</p>
                            <p>Try typing "coffee 6 bucks" or "got paid 2800"</p>
                        </div>
                    )}

                    {messages.map((msg, index) => (
                        <div key={index} className="mb-3">
                            {msg.type === 'user' && (
                                <div className="d-flex justify-content-end">
                                    <div className="bg-nudget text-white px-3 py-2 rounded-4" style={{ maxWidth: '70%' }}>
                                        {msg.text}
                                    </div>
                                </div>
                            )}
                            {msg.type === 'card' && (
                                <div className="d-flex justify-content-start">
                                    <div style={{ maxWidth: '85%', width: '100%' }}>
                                        <TransactionCard transaction={msg.transaction} onDelete={handleDelete} />
                                    </div>
                                </div>
                            )}
                            {msg.type === 'answer' && (
                                <div className="d-flex justify-content-start">
                                    <div className="px-3 py-2 rounded-4" style={{ background: '#FFF0EA', maxWidth: '70%' }}>
                                        {msg.text}
                                    </div>
                                </div>
                            )}
                            {msg.type === 'error' && (
                                <div className="d-flex justify-content-start">
                                    <div className="bg-danger-subtle text-danger px-3 py-2 rounded-4" style={{ maxWidth: '70%' }}>
                                        {msg.text}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    {loading && (
                        <div className="d-flex justify-content-start mb-3">
                            <div className="px-3 py-2 rounded-4 text-muted" style={{ background: '#FFF0EA' }}>
                                Parsing...
                            </div>
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>
            </div>

            {/* Input bar */}
            <div className="border-top bg-white px-3 py-3">
                <div className="container d-flex gap-2" style={{ maxWidth: '700px' }}>
                    <input
                        type="text"
                        className="form-control rounded-pill px-3"
                        placeholder="Type a transaction... e.g. coffee 6 bucks"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button className="btn btn-nudget rounded-pill px-4 fw-bold" onClick={handleSend} disabled={loading}>
                        Send
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Chat