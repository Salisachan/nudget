import { useState } from 'react'
import useBudgets from '../hooks/useBudgets'

const CATEGORIES = [
    'Food & Drink', 'Transport', 'Shopping',
    'Entertainment', 'Health', 'Housing', 'Education', 'Other'
]

function BudgetLimits() {
    const { budgets, loading, addBudget, deleteBudget } = useBudgets()
    const [category, setCategory] = useState('Food & Drink')
    const [limit, setLimit] = useState('')

    const handleAdd = async () => {
        if (!limit) return
        await addBudget(category, parseFloat(limit))
        setLimit('')
    }

    if (loading) return <div>Loading budgets...</div>

    return (
        <div>
            <h2>Budget Limits</h2>

            {/* Add budget form */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    {CATEGORIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
                <input
                    type="number"
                    placeholder="Monthly limit $"
                    value={limit}
                    onChange={(e) => setLimit(e.target.value)}
                />
                <button onClick={handleAdd}>Set Limit</button>
            </div>

            {/* Budget list */}
            {budgets.length === 0 ? (
                <p>No budget limits set yet.</p>
            ) : (
                budgets.map(budget => {
                    const percent = Math.min((budget.spent / budget.limit) * 100, 100)
                    const isOver = budget.spent > budget.limit

                    return (
                        <div key={budget._id} style={{ marginBottom: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>{budget.category}</span>
                                <span style={{ color: isOver ? '#ef4444' : '#666' }}>
                                    ${budget.spent.toFixed(2)} / ${budget.limit.toFixed(2)}
                                    {isOver && ' ⚠️ Over budget!'}
                                </span>
                                <button onClick={() => deleteBudget(budget._id)}>Remove</button>
                            </div>
                            {/* Progress bar */}
                            <div style={{ background: '#f0f0f0', borderRadius: '8px', height: '8px', marginTop: '8px' }}>
                                <div style={{
                                    width: `${percent}%`,
                                    background: isOver ? '#ef4444' : percent > 80 ? '#FFB347' : '#FF6B35',
                                    borderRadius: '8px',
                                    height: '8px',
                                    transition: 'width 0.3s ease'
                                }} />
                            </div>
                        </div>
                    )
                })
            )}
        </div>
    )
}

export default BudgetLimits