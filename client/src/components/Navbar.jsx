import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
    const { logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom px-3 px-lg-5 py-3 sticky-top">
            <div className="container-fluid p-0">
                <Link to="/chat" className="navbar-brand fw-bold text-nudget fs-3">Nudget</Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navContent"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navContent">
                    <div className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
                        <Link to="/chat" className="nav-link">Chat</Link>
                        <Link to="/dashboard" className="nav-link">Dashboard</Link>
                        <Link to="/transactions" className="nav-link">Transactions</Link>
                        <button onClick={handleLogout} className="btn btn-nudget-outline rounded-pill px-4 mt-2 mt-lg-0">
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar