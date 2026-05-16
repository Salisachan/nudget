import Navbar from '../components/Navbar'
import TransactionCard from '../components/TransactionCard'
import useTransactions from '../hooks/useTransactions'

function Transactions() {
    const { transactions, loading, removeTransaction } = useTransactions()

    const groupedByMonth = transactions.reduce((groups, transaction) => {
        const date = new Date(transaction.date)
        const key = date.toLocaleString('default', { month: 'long', year: 'numeric' })
        if (!groups[key]) groups[key] = []
        groups[key].push(transaction)
        return groups
    }, {})

    if (loading) return <div>Loading...</div>

    return (
        <div>
            <Navbar />
            <div>
                <h1>Transactions</h1>
                {Object.keys(groupedByMonth).length === 0 && (
                    <p>No transactions yet. Go to Chat to log your first one!</p>
                )}
                {Object.entries(groupedByMonth).map(([month, items]) => (
                    <div key={month}>
                        <h2>{month}</h2>
                        {items.map(transaction => (
                            <TransactionCard
                                key={transaction._id}
                                transaction={transaction}
                                onDelete={removeTransaction}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Transactions