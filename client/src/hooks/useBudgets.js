import { useState, useEffect } from 'react'
import api from '../api'

function useBudgets() {
    const [budgets, setBudgets] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchBudgets()
    }, [])

    const fetchBudgets = async () => {
        try {
            const res = await api.get('/budgets')
            setBudgets(res.data)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const addBudget = async (category, limit) => {
        try {
            const res = await api.post('/budgets', { category, limit })
            await fetchBudgets()
            return res.data
        } catch (err) {
            console.error(err)
        }
    }

    const deleteBudget = async (id) => {
        try {
            await api.delete(`/budgets/${id}`)
            setBudgets(prev => prev.filter(b => b._id !== id))
        } catch (err) {
            console.error(err)
        }
    }

    return { budgets, loading, error, addBudget, deleteBudget }
}

export default useBudgets