import { useParams } from 'react-router-dom'
import useEditTransaction from '../hooks/useEditTransaction'
import Navbar from '../components/Navbar'

function EditTransaction() {
    const { id } = useParams()
    const { form, loading, error, handleChange, handleSubmit, navigate } = useEditTransaction(id)

    return (
        <div>
            <Navbar />
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