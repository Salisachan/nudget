import { useNavigate } from 'react-router-dom'

function FloatingButton() {
    const navigate = useNavigate()

    return (
        <button
            onClick={() => navigate('/chat')}
            className="btn btn-nudget rounded-circle shadow"
            style={{
                position: 'fixed',
                bottom: '24px',
                right: '40px',
                width: '60px',
                height: '60px',
                fontSize: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
            }}
            title="Log a transaction"
        >
            +
        </button>
    )
}

export default FloatingButton