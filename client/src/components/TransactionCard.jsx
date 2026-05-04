import { useNavigate } from 'react-router-dom'
import api from '../api'

function TransactionCard({ transaction, onDelete }) {
    const navigate = useNavigate()

    const handleDelete = async () => {
        try {
            await api.delete(`/transactions/${transaction._id}`)
            if (onDelete) onDelete(transaction._id)
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div>
            <div>
                <span>{transaction.type === 'income' ? 'Income' : 'Expense'}</span>
                <span>{transaction.category}</span>
            </div>
            <div>
                <p>{transaction.description}</p>
                <p>{transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}</p>
            </div>
            <div>
                <p>{new Date(transaction.date).toLocaleDateString()}</p>
                <div>
                    <button onClick={() => navigate(`/edit/${transaction._id}`)}>Edit</button>
                    <button onClick={handleDelete}>Delete</button>
                </div>
            </div>
        </div>
    )
}

export default TransactionCard