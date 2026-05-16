import { useNavigate } from 'react-router-dom'

function Landing() {
    const navigate = useNavigate()

    return (
        <div style={{ fontFamily: 'Inter, sans-serif', color: '#1a1a1a' }}>

            {/* Navbar */}
            <nav style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px 60px',
                borderBottom: '1px solid #f0f0f0'
            }}>
                <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#FF6B35' }}>Nudget</h1>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={() => navigate('/login')}
                        style={{
                            padding: '10px 24px',
                            border: '2px solid #FF6B35',
                            borderRadius: '8px',
                            background: 'white',
                            color: '#FF6B35',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontSize: '15px'
                        }}>
                        Login
                    </button>
                    <button
                        onClick={() => navigate('/register')}
                        style={{
                            padding: '10px 24px',
                            border: '2px solid #FF6B35',
                            borderRadius: '8px',
                            background: '#FF6B35',
                            color: 'white',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontSize: '15px'
                        }}>
                        Get Started Free
                    </button>
                </div>
            </nav>

            {/* Hero */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                padding: '100px 60px 80px',
            }}>
                <span style={{
                    background: '#FFF0EA',
                    color: '#FF6B35',
                    padding: '6px 16px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '24px'
                }}>
                    Track money the way you think 💸
                </span>
                <h2 style={{
                    fontSize: '56px',
                    fontWeight: '800',
                    lineHeight: '1.1',
                    marginBottom: '24px',
                    maxWidth: '700px'
                }}>
                    Just type <span style={{ color: '#FF6B35' }}>"coffee $6"</span> and you're done.
                </h2>
                <p style={{
                    fontSize: '20px',
                    color: '#666',
                    maxWidth: '520px',
                    lineHeight: '1.6',
                    marginBottom: '40px'
                }}>
                    Nudget turns your natural language into organized finances. No forms, no dropdowns — just type what you spent or earned.
                </p>
                <button
                    onClick={() => navigate('/register')}
                    style={{
                        padding: '16px 40px',
                        background: '#FF6B35',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '18px',
                        fontWeight: '700',
                        cursor: 'pointer',
                    }}>
                    Get Started Free →
                </button>
            </div>

            {/* Features */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '32px',
                padding: '60px',
                background: '#FFF9F7',
                flexWrap: 'wrap'
            }}>
                {[
                    { emoji: '💬', title: 'Just Type It', desc: 'Log expenses and income in plain language. No tapping through menus.' },
                    { emoji: '📊', title: 'See the Big Picture', desc: 'Instant dashboard showing income, spending, and your net balance.' },
                    { emoji: '🎯', title: 'Set Budget Limits', desc: 'Set monthly limits per category and get warned before you overspend.' },
                ].map((f, i) => (
                    <div key={i} style={{
                        background: 'white',
                        borderRadius: '16px',
                        padding: '32px',
                        width: '280px',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '36px', marginBottom: '16px' }}>{f.emoji}</div>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>{f.title}</h3>
                        <p style={{ color: '#666', lineHeight: '1.6', fontSize: '15px' }}>{f.desc}</p>
                    </div>
                ))}
            </div>

            {/* CTA */}
            <div style={{
                textAlign: 'center',
                padding: '80px 60px',
            }}>
                <h3 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '16px' }}>
                    Ready to stop forgetting where your money went?
                </h3>
                <p style={{ color: '#666', fontSize: '18px', marginBottom: '32px' }}>
                    Free to use. No credit card required.
                </p>
                <button
                    onClick={() => navigate('/register')}
                    style={{
                        padding: '16px 40px',
                        background: '#FF6B35',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '18px',
                        fontWeight: '700',
                        cursor: 'pointer',
                    }}>
                    Get Started Free →
                </button>
            </div>

            {/* Footer */}
            <div style={{
                textAlign: 'center',
                padding: '24px',
                borderTop: '1px solid #f0f0f0',
                color: '#999',
                fontSize: '14px'
            }}>
                © 2026 Nudget. Built with ❤️ as a capstone project.
            </div>

        </div>
    )
}

export default Landing