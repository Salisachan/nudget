import { useState } from 'react'
import Navbar from '../components/Navbar'
import useDashboard from '../hooks/useDashboard'
import BudgetLimits from '../components/BudgetLimits'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts'

const COLORS = ['#FF6B35', '#FFB347', '#FFD700', '#90EE90', '#87CEEB', '#DDA0DD', '#F08080', '#98FB98']

function Dashboard() {
    const { summary, loading, error } = useDashboard()
    const [chartType, setChartType] = useState('bar')

    const chartData = Object.entries(summary.byCategory).map(([name, value]) => ({
        name,
        value: parseFloat(value.toFixed(2))
    }))

    if (loading) return (
        <div>
            <Navbar />
            <div className="container py-5 text-center text-muted">Loading...</div>
        </div>
    )
    if (error) return (
        <div>
            <Navbar />
            <div className="container py-5 text-center text-muted">Something went wrong.</div>
        </div>
    )

    return (
        <div className="bg-nudget-light min-vh-100">
            <Navbar />
            <div className="container py-4" style={{ maxWidth: '900px' }}>
                <h1 className="fw-bold mb-1">Dashboard</h1>
                <p className="text-muted mb-4">This month's overview</p>

                {/* Summary Cards */}
                <div className="row g-3 mb-4">
                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm rounded-4 p-4">
                            <p className="text-muted mb-1">Total Income</p>
                            <h3 className="fw-bold text-success mb-0">${summary.income.toFixed(2)}</h3>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm rounded-4 p-4">
                            <p className="text-muted mb-1">Total Expenses</p>
                            <h3 className="fw-bold text-danger mb-0">${summary.expenses.toFixed(2)}</h3>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm rounded-4 p-4">
                            <p className="text-muted mb-1">Net Balance</p>
                            <h3 className={`fw-bold mb-0 ${summary.net >= 0 ? 'text-success' : 'text-danger'}`}>
                                ${summary.net.toFixed(2)}
                            </h3>
                        </div>
                    </div>
                </div>

                {/* Category Chart */}
                <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="fw-bold mb-0">Spending by Category</h5>
                        <div className="d-flex gap-2">
                            <button
                                className={`btn btn-sm rounded-pill px-3 ${chartType === 'bar' ? 'btn-nudget' : 'btn-nudget-outline'}`}
                                onClick={() => setChartType('bar')}>
                                Bar
                            </button>
                            <button
                                className={`btn btn-sm rounded-pill px-3 ${chartType === 'pie' ? 'btn-nudget' : 'btn-nudget-outline'}`}
                                onClick={() => setChartType('pie')}>
                                Pie
                            </button>
                        </div>
                    </div>

                    {chartData.length === 0 ? (
                        <p className="text-muted text-center py-4 mb-0">No expense data yet for this month.</p>
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

                {/* Budget Limits */}
                <div className="card border-0 shadow-sm rounded-4 p-4">
                    <BudgetLimits />
                </div>

            </div>
        </div>
    )
}

export default Dashboard