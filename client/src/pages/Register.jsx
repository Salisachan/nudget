import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api'

function Register() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            await api.post('/auth/register', { email, password })
            navigate('/login')
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    const googleURL = import.meta.env.VITE_API_URL.replace('/api', '') + '/api/auth/google'

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-nudget-light">
            <div className="card border-0 shadow-sm rounded-4 p-5" style={{ width: '100%', maxWidth: '420px' }}>
                <Link to="/" className="text-nudget fw-semibold text-decoration-none mb-3 d-inline-block">← Back to home</Link>
                <div className="text-center mb-4">
                    <div className="fw-bold fs-3 text-nudget mb-1">Nudget</div>
                    <p className="text-muted">Create your account</p>
                </div>
                {error && <div className="alert alert-danger py-2">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="you@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="form-label fw-semibold">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button className="btn btn-nudget w-100 py-2 fw-bold" type="submit" disabled={loading}>
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>
                <div className="text-center my-3 text-muted">or</div>
                <a href={googleURL} className="btn btn-outline-secondary w-100 rounded-pill py-2 fw-semibold">
                    <img src="https://www.google.com/favicon.ico" width="18" height="18" className="me-2" alt="Google" />
                    Continue with Google
                </a>
                <p className="text-center text-muted mt-4 mb-0" style={{ fontSize: '14px' }}>
                    Already have an account? <Link to="/login" className="text-nudget fw-semibold text-decoration-none">Login</Link>
                </p>
            </div>
        </div>
    )
}

export default Register