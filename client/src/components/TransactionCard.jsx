import { useNavigate } from 'react-router-dom'
import api from '../api'

function TransactionCard({ transaction, onDelete, row = false }) {
    const navigate = useNavigate()

    if (!transaction) return null

    console.log('Transaction date:', transaction.date)

    const handleDelete = async () => {
        try {
            await api.delete(`/transactions/${transaction._id}`)
            if (onDelete) onDelete(transaction._id)
        } catch (err) {
            console.error(err)
        }
    }

    const isIncome = transaction.type === 'income'

    // Row layout for Transactions page
    // Row layout for Transactions page
    if (row) {
        return (
            <div className="card border-0 shadow-sm rounded-3 px-3 py-2 mb-2">
                <div className="d-flex justify-content-between align-items-center">
                    {/* Left — date + details in columns */}
                    <div className="d-flex align-items-center gap-3">
                        <small className="text-muted" style={{ minWidth: '85px' }}>
                            {new Date(transaction.date).toLocaleDateString('en-CA', { timeZone: 'UTC' })}
                        </small>
                        <span className={`badge rounded-pill ${isIncome ? 'bg-success' : 'bg-danger'}`} style={{ fontSize: '10px', minWidth: '70px' }}>
                            {isIncome ? 'Income' : 'Expense'}
                        </span>
                        <span className="text-muted small" style={{ minWidth: '110px' }}>{transaction.category}</span>
                        <span className="fw-semibold">{transaction.description}</span>
                    </div>

                    {/* Right — amount + actions */}
                    <div className="d-flex align-items-center gap-3">
                        <span className={`fw-bold ${isIncome ? 'text-success' : 'text-danger'}`}>
                            {isIncome ? '+' : '-'}${transaction.amount.toFixed(2)}
                        </span>
                        <div className="d-flex gap-1">
                            <button
                                className="btn btn-sm btn-outline-secondary rounded-pill px-2 py-0"
                                style={{ fontSize: '12px' }}
                                onClick={() => navigate(`/edit/${transaction._id}`)}>
                                Edit
                            </button>
                            <button
                                className="btn btn-sm btn-outline-danger rounded-pill px-2 py-0"
                                style={{ fontSize: '12px' }}
                                onClick={handleDelete}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Default card layout for Chat page
    return (
        <div className="card border-0 shadow-sm rounded-4 p-3 mb-1" style={{ maxWidth: '260px' }}>
            <div className="d-flex align-items-center gap-2 mb-2">
                <span className={`badge rounded-pill ${isIncome ? 'bg-success' : 'bg-danger'}`}>
                    {isIncome ? 'Income' : 'Expense'}
                </span>
                <span className="text-muted small fw-semibold">{transaction.category}</span>
            </div>
            <div className="fw-semibold mb-1">{transaction.description}</div>
            <div className={`fw-bold fs-4 mb-2 ${isIncome ? 'text-success' : 'text-danger'}`}>
                {isIncome ? '+' : '-'}${transaction.amount.toFixed(2)}
            </div>
            <div className="text-muted small mb-2">
                {new Date(transaction.date).toLocaleDateString()}
            </div>
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