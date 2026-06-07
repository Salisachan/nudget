import { useState } from 'react'
import api from '../api'

const EXPENSE_CATEGORIES = ['Food & Drink', 'Transport', 'Shopping', 'Entertainment', 'Health', 'Housing', 'Education', 'Other']
const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investment', 'Gift', 'Other Income']

function AddTransactionModal({ show, onClose, onAdd }) {
    const [form, setForm] = useState({
        type: 'expense',
        amount: '',
        category: 'Food & Drink',
        description: '',
        date: new Date().toISOString().split('T')[0]
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const categories = form.type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES

    const handleChange = (e) => {
        const updated = { ...form, [e.target.name]: e.target.value }
        if (e.target.name === 'type') {
            updated.category = e.target.value === 'expense' ? 'Food & Drink' : 'Salary'
        }
        setForm(updated)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            const res = await api.post('/transactions/manual', form)
            onAdd(res.data.transaction)
            onClose()
            setForm({
                type: 'expense',
                amount: '',
                category: 'Food & Drink',
                description: '',
                date: new Date().toISOString().split('T')[0]
            })
        } catch (err) {
            setError('Could not save transaction. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    if (!show) return null

    return (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content rounded-4 border-0">
                    <div className="modal-header border-0 pb-0">
                        <h5 className="modal-title fw-bold">Add Transaction</h5>
                        <button className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {error && <div className="alert alert-danger py-2">{error}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Type</label>
                                <select name="type" className="form-select" value={form.type} onChange={handleChange}>
                                    <option value="expense">Expense</option>
                                    <option value="income">Income</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Amount</label>
                                <input
                                    type="number"
                                    name="amount"
                                    className="form-control"
                                    value={form.amount}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Category</label>
                                <select name="category" className="form-select" value={form.category} onChange={handleChange}>
                                    {categories.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Description</label>
                                <input
                                    type="text"
                                    name="description"
                                    className="form-control"
                                    value={form.description}
                                    onChange={handleChange}
                                    placeholder="What was this for?"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="form-label fw-semibold">Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    className="form-control"
                                    value={form.date}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="d-flex gap-2">
                                <button type="submit" className="btn btn-nudget rounded-pill px-4 fw-bold flex-fill" disabled={loading}>
                                    {loading ? 'Saving...' : 'Save Transaction'}
                                </button>
                                <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={onClose}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddTransactionModal