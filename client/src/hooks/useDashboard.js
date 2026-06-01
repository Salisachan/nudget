import { useState, useEffect } from 'react'
import api from '../api'

function useDashboard(month, year) {
    const [summary, setSummary] = useState({ income: 0, expenses: 0, net: 0, byCategory: {} })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchSummary = async () => {
            setLoading(true)
            try {
                const res = await api.get(`/transactions/summary?month=${month}&year=${year}`)
                setSummary(res.data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchSummary()
    }, [month, year])

    return { summary, loading, error }
}

export default useDashboard