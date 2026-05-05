import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api'

function EditTransaction() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [form, setForm] = useState({
        type: '',
        amount: '',
        category: '',
        description: '',
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
            await api.put(`/transactions/${id}`, form)
            navigate('/chat')
        } catch (err) {
            setError('Could not update transaction')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <h1>Edit Transaction</h1>
            {error && <p>{error}</p>}
            <form onSubmit={handleSubmit}>
                <select name="type" value={form.type} onChange={handleChange}>
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                </select>
                <input
                    type="number"
                    name="amount"
                    value={form.amount}
                    onChange={handleChange}
                    placeholder="Amount"
                    required
                />
                <input
                    type="text"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="Category"
                    required
                />
                <input
                    type="text"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Description"
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save'}
                </button>
                <button type="button" onClick={() => navigate('/chat')}>Cancel</button>
            </form>
        </div>
    )
}

export default EditTransaction