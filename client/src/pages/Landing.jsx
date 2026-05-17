import { useNavigate } from 'react-router-dom'
import './Landing.css'

function Landing() {
    const navigate = useNavigate()

    return (
        <div className="landing">

            {/* Navbar */}
            <nav className="landing-nav">
                <h1 className="landing-logo">Nudget</h1>
                <div className="landing-nav-buttons">
                    <button className="btn-outline-orange" onClick={() => navigate('/login')}>
                        Login
                    </button>
                    <button className="btn-orange" onClick={() => navigate('/register')}>
                        Get Started Free
                    </button>
                </div>
            </nav>

            {/* Hero */}
            <div className="landing-hero">
                <span className="landing-badge">Track money the way you think 💸</span>
                <h2>
                    Just type <span className="highlight">"coffee $6"</span> and you're done.
                </h2>
                <p>
                    Nudget turns your natural language into organized finances. No forms, no dropdowns — just type what you spent or earned.
                </p>
                <button className="btn-orange-lg" onClick={() => navigate('/register')}>
                    Get Started Free →
                </button>
            </div>

            {/* Features */}
            <div className="landing-features">
                {[
                    { emoji: '💬', title: 'Just Type It', desc: 'Log expenses and income in plain language. No tapping through menus.' },
                    { emoji: '📊', title: 'See the Big Picture', desc: 'Instant dashboard showing income, spending, and your net balance.' },
                    { emoji: '🎯', title: 'Set Budget Limits', desc: 'Set monthly limits per category and get warned before you overspend.' },
                ].map((f, i) => (
                    <div key={i} className="feature-card">
                        <div className="feature-emoji">{f.emoji}</div>
                        <h3>{f.title}</h3>
                        <p>{f.desc}</p>
                    </div>
                ))}
            </div>

            {/* CTA */}
            <div className="landing-cta">
                <h3>Ready to stop forgetting where your money went?</h3>
                <p>Free to use. No credit card required.</p>
                <button className="btn-orange-lg" onClick={() => navigate('/register')}>
                    Get Started Free →
                </button>
            </div>

            {/* Footer */}
            <div className="landing-footer">
                © 2026 Nudget. Built with ❤️ as a capstone project.
            </div>

        </div>
    )
}

export default Landing