import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

function useEditTransaction(id) {
    const navigate = useNavigate()
    const [form, setForm] = useState({
        type: '',
        amount: '',
        category: '',
        description: '',
        date: '',
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchTransaction = async () => {
            try {
                const res = await api.get(`/transactions/${id}`)
                setForm({
                    type: res.data.type,
                    amount: res.data.amount,
                    category: res.data.category,
                    description: res.data.description,
                    date: new Date(res.data.date).toLocaleDateString('en-CA'),
                })
            } catch (err) {
                setError('Transaction not found')
            }
        }
        fetchTransaction()
    }, [id])

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const formToSend = {
                ...form,
                date: new Date(form.date + 'T12:00:00').toISOString()
            }
            await api.put(`/transactions/${id}`, formToSend)
            window.location.href = '/chat'
        } catch (err) {
            setError('Could not update transaction')
        } finally {
            setLoading(false)
        }
    }

    return { form, loading, error, handleChange, handleSubmit, navigate }
}

export default useEditTransaction