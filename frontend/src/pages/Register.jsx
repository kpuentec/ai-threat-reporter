import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Register() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) { setError('Passwords do not match.'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    setLoading(false)
    if (error) { setError(error.message); return }
    navigate('/dashboard')
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 60px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div className="card animate-fadeInUp" style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img src="/shield.png" alt="ThreatReporter" style={{ height: '60px', width: '60px', display: 'block', margin: '0 auto' }} />
          <h1 style={{ color: 'var(--white)', fontSize: '1.6rem', fontWeight: 700, marginTop: '0.5rem' }}>Create account</h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginTop: '0.3rem' }}>Start analyzing threats today</p>
        </div>

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ color: 'var(--muted)', fontSize: '0.85rem', display: 'block', marginBottom: '0.4rem' }}>Email</label>
            <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
          <div>
            <label style={{ color: 'var(--muted)', fontSize: '0.85rem', display: 'block', marginBottom: '0.4rem' }}>Password</label>
            <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 6 characters" required />
          </div>
          <div>
            <label style={{ color: 'var(--muted)', fontSize: '0.85rem', display: 'block', marginBottom: '0.4rem' }}>Confirm Password</label>
            <input className="input" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="••••••••" required />
          </div>

          {error && (
            <p style={{ color: 'var(--red)', fontSize: '0.85rem', background: 'rgba(239,68,68,0.1)', padding: '0.6rem 0.9rem', borderRadius: '0.5rem' }}>
              {error}
            </p>
          )}

          <button className="btn-primary" type="submit" disabled={loading} style={{ marginTop: '0.5rem', width: '100%', borderRadius: '0.75rem' }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '0.85rem', marginTop: '1.5rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--blue-light)', textDecoration: 'none', fontWeight: 600 }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}