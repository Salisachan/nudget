import { useState } from 'react'
import Navbar from '../components/Navbar'
import useDashboard from '../hooks/useDashboard'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts'

const COLORS = ['#FF6B35', '#FFB347', '#FFD700', '#90EE90', '#87CEEB', '#DDA0DD', '#F08080', '#98FB98']

function Dashboard() {
    const { summary, loading, error } = useDashboard()
    const [chartType, setChartType] = useState('bar')

    const chartData = Object.entries(summary.byCategory).map(([name, value]) => ({
        name,
        value: parseFloat(value.toFixed(2))
    }))

    if (loading) return <div>Loading...</div>
    if (error) return <div>Something went wrong.</div>

    return (
        <div>
            <Navbar />
            <div>
                <h1>Dashboard</h1>
                <p>This month's overview</p>

                {/* Summary Cards */}
                <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
                    <div style={{ padding: '24px', background: '#FFF9F7', borderRadius: '12px', flex: 1 }}>
                        <p>Total Income</p>
                        <h2 style={{ color: '#22c55e' }}>${summary.income.toFixed(2)}</h2>
                    </div>
                    <div style={{ padding: '24px', background: '#FFF9F7', borderRadius: '12px', flex: 1 }}>
                        <p>Total Expenses</p>
                        <h2 style={{ color: '#ef4444' }}>${summary.expenses.toFixed(2)}</h2>
                    </div>
                    <div style={{ padding: '24px', background: '#FFF9F7', borderRadius: '12px', flex: 1 }}>
                        <p>Net Balance</p>
                        <h2 style={{ color: summary.net >= 0 ? '#22c55e' : '#ef4444' }}>
                            ${summary.net.toFixed(2)}
                        </h2>
                    </div>
                </div>

                {/* Category Chart */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h2>Spending by Category</h2>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                onClick={() => setChartType('bar')}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    border: '2px solid #FF6B35',
                                    background: chartType === 'bar' ? '#FF6B35' : 'white',
                                    color: chartType === 'bar' ? 'white' : '#FF6B35',
                                    cursor: 'pointer',
                                    fontWeight: '600'
                                }}>
                                Bar
                            </button>
                            <button
                                onClick={() => setChartType('pie')}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    border: '2px solid #FF6B35',
                                    background: chartType === 'pie' ? '#FF6B35' : 'white',
                                    color: chartType === 'pie' ? 'white' : '#FF6B35',
                                    cursor: 'pointer',
                                    fontWeight: '600'
                                }}>
                                Pie
                            </button>
                        </div>
                    </div>

                    {chartData.length === 0 ? (
                        <p>No expense data yet for this month.</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            {chartType === 'bar' ? (
                                <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => `$${value}`} />
                                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            ) : (
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => `$${value}`} />
                                    <Legend />
                                </PieChart>
                            )}
                        </ResponsiveContainer>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Dashboard