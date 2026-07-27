import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function AuthCallback() {
    const navigate = useNavigate()
    const { login } = useAuth()
    const handled = useRef(false)

    useEffect(() => {
        if (handled.current) return
        handled.current = true

        const params = new URLSearchParams(window.location.search)
        const token = params.get('token')
        const userId = params.get('userId')

        if (token && userId) {
            login(token, userId)
            navigate('/chat')
        } else {
            navigate('/login')
        }
    }, [])

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center">
            <p className="text-muted">Signing you in...</p>
        </div>
    )
}

export default AuthCallback