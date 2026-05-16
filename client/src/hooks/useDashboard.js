import { useState, useEffect } from 'react'
import api from '../api'

function useDashboard() {
    const [summary, setSummary] = useState({ income: 0, expenses: 0, net: 0, byCategory: {} })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const res = await api.get('/transactions/summary')
                setSummary(res.data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchSummary()
    }, [])

    return { summary, loading, error }
}

export default useDashboard