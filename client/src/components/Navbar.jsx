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
        <nav>
            <Link to="/chat">Nudget</Link>
            <div>
                <Link to="/chat">Chat</Link>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/transactions">Transactions</Link>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </nav>
    )
}

export default Navbar