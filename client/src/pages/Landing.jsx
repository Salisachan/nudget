import { useNavigate } from 'react-router-dom'

function Landing() {
    const navigate = useNavigate()

    return (
        <div>

            {/* Navbar */}
            <nav className="navbar navbar-light bg-white border-bottom px-5 py-3">
                <span className="navbar-brand fw-bold fs-4 text-nudget">Nudget</span>
                <div className="d-flex gap-2">
                    <button className="btn btn-nudget-outline rounded-3 px-4" onClick={() => navigate('/login')}>
                        Login
                    </button>
                    <button className="btn btn-nudget rounded-3 px-4" onClick={() => navigate('/register')}>
                        Get Started Free
                    </button>
                </div>
            </nav>

            {/* Hero */}
            <div className="d-flex flex-column align-items-center text-center py-5 px-4" style={{ paddingTop: '80px' }}>
                <span className="badge-nudget mb-4">Track money the way you think 💸</span>
                <h1 className="fw-bold mb-4" style={{ fontSize: '56px', maxWidth: '700px', lineHeight: '1.1' }}>
                    Just type <span className="text-nudget">"coffee $6"</span> and you're done.
                </h1>
                <p className="text-muted mb-5" style={{ fontSize: '20px', maxWidth: '520px', lineHeight: '1.6' }}>
                    Nudget turns your natural language into organized finances. No forms, no dropdowns — just type what you spent or earned.
                </p>
                <button className="btn btn-nudget btn-lg rounded-3 px-5 py-3 fw-bold" onClick={() => navigate('/register')}>
                    Get Started Free →
                </button>
            </div>

            {/* Features */}
            <div className="bg-nudget-light py-5">
                <div className="container">
                    <div className="row justify-content-center g-4">
                        {[
                            { emoji: '💬', title: 'Just Type It', desc: 'Log expenses and income in plain language. No tapping through menus.' },
                            { emoji: '📊', title: 'See the Big Picture', desc: 'Instant dashboard showing income, spending, and your net balance.' },
                            { emoji: '🎯', title: 'Set Budget Limits', desc: 'Set monthly limits per category and get warned before you overspend.' },
                        ].map((f, i) => (
                            <div key={i} className="col-md-4">
                                <div className="card border-0 shadow-sm rounded-4 p-4 text-center h-100">
                                    <div style={{ fontSize: '36px' }} className="mb-3">{f.emoji}</div>
                                    <h5 className="fw-bold mb-2">{f.title}</h5>
                                    <p className="text-muted mb-0" style={{ fontSize: '15px' }}>{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="text-center py-5 px-4">
                <h2 className="fw-bold mb-3">Ready to stop forgetting where your money went?</h2>
                <p className="text-muted mb-4" style={{ fontSize: '18px' }}>Free to use. No credit card required.</p>
                <button className="btn btn-nudget btn-lg rounded-3 px-5 py-3 fw-bold" onClick={() => navigate('/register')}>
                    Get Started Free →
                </button>
            </div>

            {/* Footer */}
            <div className="text-center py-4 border-top text-muted" style={{ fontSize: '14px' }}>
                © 2026 Nudget. Built with ❤️ as a capstone project.
            </div>

        </div>
    )
}

export default Landing