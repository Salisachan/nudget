import { useNavigate } from 'react-router-dom'
import api from '../api'

function TransactionCard({ transaction, onDelete }) {
    const navigate = useNavigate()

    if (!transaction) return null

    const handleDelete = async () => {
        try {
            await api.delete(`/transactions/${transaction._id}`)
            if (onDelete) onDelete(transaction._id)
        } catch (err) {
            console.error(err)
        }
    }

    const isIncome = transaction.type === 'income'

    return (
        <div className="card border-0 shadow-sm rounded-4 p-3 mb-2">
            {/* Top row — type badge + category */}
            <div className="d-flex align-items-center gap-2 mb-2">
                <span className={`badge rounded-pill ${isIncome ? 'bg-success' : 'bg-danger'}`}>
                    {isIncome ? 'Income' : 'Expense'}
                </span>
                <span className="text-muted small fw-semibold">{transaction.category}</span>
            </div>

            {/* Middle — description + amount */}
            <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="fw-semibold">{transaction.description}</span>
                <span className={`fw-bold fs-5 ${isIncome ? 'text-success' : 'text-danger'}`}>
                    {isIncome ? '+' : '-'}${transaction.amount.toFixed(2)}
                </span>
            </div>

            {/* Bottom — date + actions */}
            <div className="d-flex justify-content-between align-items-center">
                <small className="text-muted">{new Date(transaction.date).toLocaleDateString()}</small>
                <div className="d-flex gap-2">
                    <button
                        className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                        onClick={() => navigate(`/edit/${transaction._id}`)}>
                        Edit
                    </button>
                    <button
                        className="btn btn-sm btn-outline-danger rounded-pill px-3"
                        onClick={handleDelete}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    )
}

export default TransactionCard