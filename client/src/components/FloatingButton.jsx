import { useState } from 'react'
import AddTransaction from './AddTransaction'
import useTransactions from '../hooks/useTransactions'

function FloatingButton() {
    const [show, setShow] = useState(false)
    const { addTransaction } = useTransactions()

    const handleAdd = (transaction) => {
        addTransaction(transaction)
        window.location.reload()
    }

    return (
        <>
            <button
                onClick={() => setShow(true)}
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
                title="Add transaction"
            >
                +
            </button>
            <AddTransaction
                show={show}
                onClose={() => setShow(false)}
                onAdd={handleAdd}
            />
        </>
    )
}

export default FloatingButton