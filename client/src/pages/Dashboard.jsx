import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import useDashboard from '../hooks/useDashboard'
import BudgetLimits from '../components/BudgetLimits'
import api from '../api'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts'
import FloatingButton from '../components/FloatingButton'

const COLORS = ['#FF6B35', '#FFB347', '#FFD700', '#90EE90', '#87CEEB', '#DDA0DD', '#F08080', '#98FB98']
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function Dashboard() {
    const now = new Date()
    const [month, setMonth] = useState(now.getMonth() + 1)
    const [year, setYear] = useState(now.getFullYear())
    const [options, setOptions] = useState([])
    const [chartType, setChartType] = useState('bar')

    const { summary, loading, error } = useDashboard(month, year)

    // Build the list of available month/year options
    useEffect(() => {
        const fetchRange = async () => {
            try {
                const res = await api.get('/transactions/range')
                const { firstMonth, firstYear } = res.data

                const opts = []
                const current = new Date()
                let y = firstYear
                let m = firstMonth

                while (y < current.getFullYear() || (y === current.getFullYear() && m <= current.getMonth() + 1)) {
                    opts.push({ month: m, year: y })
                    m++
                    if (m > 12) { m = 1; y++ }
                }
                setOptions(opts.reverse()) // newest first
            } catch (err) {
                console.error(err)
            }
        }
        fetchRange()
    }, [])

    const handleSelect = (e) => {
        const [m, y] = e.target.value.split('-').map(Number)
        setMonth(m)
        setYear(y)
    }

    const chartData = Object.entries(summary.byCategory).map(([name, value]) => ({
        name,
        value: parseFloat(value.toFixed(2))
    }))

    return (
        <div className="bg-nudget-light min-vh-100">
            <Navbar />
            <div className="container py-4" style={{ maxWidth: '900px' }}>
                <h1 className="fw-bold mb-1">Dashboard</h1>
                <p className="text-muted mb-3">Viewing {MONTH_NAMES[month - 1]} {year}</p>

                {/* Month Filter */}
                <div className="mb-4">
                    <select className="form-select w-auto" value={`${month}-${year}`} onChange={handleSelect}>
                        {options.map(opt => (
                            <option key={`${opt.month}-${opt.year}`} value={`${opt.month}-${opt.year}`}>
                                {MONTH_NAMES[opt.month - 1]} {opt.year}
                            </option>
                        ))}
                    </select>
                </div>

                {loading ? (
                    <p className="text-muted text-center py-5">Loading...</p>
                ) : error ? (
                    <p className="text-muted text-center py-5">Something went wrong.</p>
                ) : (
                    <>
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
                                <p className="text-muted text-center py-4 mb-0">No expense data for this month.</p>
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
                    </>
                )}
            </div>
            <FloatingButton />
        </div>
    )
}

export default Dashboard