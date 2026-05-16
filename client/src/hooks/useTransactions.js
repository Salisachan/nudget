import { useState, useEffect } from 'react'
import api from '../api'

function useTransactions() {
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const res = await api.get('/transactions')
                setTransactions(res.data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchTransactions()
    }, [])

    const removeTransaction = (id) => {
        setTransactions(prev => prev.filter(t => t._id !== id))
    }

    const addTransaction = (transaction) => {
        setTransactions(prev => [transaction, ...prev])
    }

    return { transactions, loading, error, removeTransaction, addTransaction }
}

export default useTransactions