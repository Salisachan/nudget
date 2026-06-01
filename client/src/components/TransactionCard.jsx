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
        <div className="card border-0 shadow-sm rounded-4 p-3 mb-1" style={{ maxWidth: '300px' }}>
            {/* Type badge + category */}
            <div className="d-flex align-items-center gap-2 mb-2">
                <span className={`badge rounded-pill ${isIncome ? 'bg-success' : 'bg-danger'}`}>
                    {isIncome ? 'Income' : 'Expense'}
                </span>
                <span className="text-muted small fw-semibold">{transaction.category}</span>
            </div>

            {/* Description */}
            <div className="fw-semibold mb-1">{transaction.description}</div>

            {/* Amount */}
            <div className={`fw-bold fs-4 mb-2 ${isIncome ? 'text-success' : 'text-danger'}`}>
                {isIncome ? '+' : '-'}${transaction.amount.toFixed(2)}
            </div>

            {/* Date */}
            <div className="text-muted small mb-2">
                {new Date(transaction.date).toLocaleDateString()}
            </div>

            {/* Actions */}
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
    )
}

export default TransactionCard