import { useParams } from 'react-router-dom'
import useEditTransaction from '../hooks/useEditTransaction'
import Navbar from '../components/Navbar'

function EditTransaction() {
    const { id } = useParams()
    const { form, loading, error, handleChange, handleSubmit, navigate } = useEditTransaction(id)

    return (
        <div className="bg-nudget-light min-vh-100">
            <Navbar />
            <div className="container py-4" style={{ maxWidth: '500px' }}>
                <div className="card border-0 shadow-sm rounded-4 p-4">
                    <h4 className="fw-bold mb-4">Edit Transaction</h4>
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
                                placeholder="Amount"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-semibold">Category</label>
                            <input
                                type="text"
                                name="category"
                                className="form-control"
                                value={form.category}
                                onChange={handleChange}
                                placeholder="Category"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="form-label fw-semibold">Description</label>
                            <input
                                type="text"
                                name="description"
                                className="form-control"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Description"
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
                            <button type="submit" className="btn btn-nudget rounded-pill px-4 fw-bold" disabled={loading}>
                                {loading ? 'Saving...' : 'Save'}
                            </button>
                            <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={() => navigate('/chat')}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EditTransaction