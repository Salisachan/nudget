import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

function Navbar() {
    const { logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    return (
        <nav className="navbar">
            <Link to="/chat" className="navbar-logo">Nudget</Link>
            <div className="navbar-links">
                <Link to="/chat" className="navbar-link">Chat</Link>
                <Link to="/dashboard" className="navbar-link">Dashboard</Link>
                <Link to="/transactions" className="navbar-link">Transactions</Link>
                <button onClick={handleLogout} className="navbar-logout">Logout</button>
            </div>
        </nav>
    )
}

export default Navbar