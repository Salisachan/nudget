import Navbar from '../components/Navbar'
import TransactionCard from '../components/TransactionCard'
import useTransactions from '../hooks/useTransactions'
import FloatingButton from '../components/FloatingButton'

function Transactions() {
    const { transactions, loading, removeTransaction } = useTransactions()

    const groupedByMonth = transactions.reduce((groups, transaction) => {
        const date = new Date(transaction.date)
        const key = date.toLocaleString('default', { month: 'long', year: 'numeric' })
        if (!groups[key]) groups[key] = []
        groups[key].push(transaction)
        return groups
    }, {})

    if (loading) return (
        <div className="bg-nudget-light min-vh-100">
            <Navbar />
            <div className="container py-5 text-center text-muted">Loading...</div>
        </div>
    )

    return (
        <div className="bg-nudget-light min-vh-100">
            <Navbar />
            <div className="container py-4" style={{ maxWidth: '900px' }}>
                <h1 className="fw-bold mb-4">Transactions</h1>

                {Object.keys(groupedByMonth).length === 0 && (
                    <div className="text-center text-muted py-5">
                        <p className="fs-5">No transactions yet</p>
                        <p>Go to Chat to log your first one!</p>
                    </div>
                )}

                {Object.entries(groupedByMonth).map(([month, items]) => (
                    <div key={month} className="mb-4">
                        <h5 className="fw-bold text-muted mb-3">{month}</h5>
                        {items.map(transaction => (
                            <TransactionCard
                                key={transaction._id}
                                transaction={transaction}
                                onDelete={removeTransaction}
                                row={true}
                            />
                        ))}
                    </div>
                ))}
            </div>
            <FloatingButton />
        </div>
    )
}

export default Transactions