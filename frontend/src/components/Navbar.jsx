import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path) => location.pathname === path

  const linkStyle = (path) => ({
    color: isActive(path) ? 'var(--white)' : 'var(--muted)',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: isActive(path) ? 600 : 400,
    transition: 'color 0.2s',
    borderBottom: isActive(path) ? '2px solid var(--blue)' : '2px solid transparent',
    paddingBottom: '2px',
  })

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <nav style={{
      background: 'rgba(15,23,42,0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '0 2rem',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <img src="/shield.png" alt="ThreatReporter" style={{ height: '28px', width: '28px' }} />
        <span style={{ color: 'var(--white)', fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.01em' }}>
          ThreatReporter
        </span>
      </Link>

      <div style={{ display: 'flex', gap: '1.75rem', alignItems: 'center' }}>
        {user ? (
          <>
            <Link to="/dashboard" style={linkStyle('/dashboard')}>Dashboard</Link>
            <Link to="/history" style={linkStyle('/history')}>History</Link>
            <Link to="/stats" style={linkStyle('/stats')}>Stats</Link>
            <button onClick={handleSignOut} className="btn-secondary" style={{ padding: '0.4rem 1.1rem', fontSize: '0.85rem' }}>
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={linkStyle('/login')}>Login</Link>
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <button className="btn-primary" style={{ padding: '0.4rem 1.1rem', fontSize: '0.85rem' }}>
                Get Started
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}