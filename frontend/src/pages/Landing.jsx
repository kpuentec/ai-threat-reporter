import { Link } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

const FEATURES = [
  { icon: '🤖', title: 'AI-Powered Analysis', desc: 'Gemini 2.0 Flash analyzes your logs and URLs in seconds, returning structured threat assessments with severity scores.' },
  { icon: '📂', title: 'Log File Upload', desc: 'Upload .txt or .log files up to 200 lines. The system batch-analyzes each chunk and returns a full threat report.' },
  { icon: '🔍', title: 'VirusTotal Integration', desc: "Suspicious URLs are automatically scanned against VirusTotal's database of 70+ security vendors." },
  { icon: '📊', title: 'Threat History & Stats', desc: 'Every analysis is saved to your personal dashboard with severity breakdowns, trends, and usage tracking.' },
]

const TIMELINE = [
  { label: 'Implemented', items: [
    'AI threat analysis via Gemini 2.0 Flash',
    'Structured severity scoring (Low to Critical)',
    'Log file upload & batch processing',
    'Secure auth with per-user history',
    'Daily credit limits & usage tracking',
    'React frontend',
    'Deployed on Render + Vercel',
  ]},
  { label: 'Planned', items: [
    'PDF export of threat reports',
    'VirusTotal URL scanning',
    'Email alerts for Critical findings',
    'Team workspaces & shared history',
    'Fine-tuned threat classification model',
    'IP reputation lookup integration',
    'SIEM-style dashboard with live feed',
  ]},
]

const STEPS = [
  { n: '01', title: 'Paste or Upload', desc: 'Drop in a log snippet, a suspicious URL, or upload a .log file.' },
  { n: '02', title: 'AI Analyzes', desc: 'Gemini processes the input and returns a structured threat assessment.' },
  { n: '03', title: 'Review Results', desc: 'Get threat type, severity badge, impact summary, and remediation steps.' },
  { n: '04', title: 'Track History', desc: 'Every analysis is saved to your personal dashboard for future reference.' },
]

export default function Landing() {
  const { user } = useAuth()

  return (
    <div style={{ fontFamily: 'Georgia, serif' }}>

      {/* Hero */}
      <section style={{
        minHeight: '88vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '4rem 1.5rem',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.12) 0%, transparent 70%)',
      }}>
        <h1 style={{
          fontSize: 'clamp(2.2rem, 6vw, 4rem)',
          fontWeight: 700,
          color: 'var(--white)',
          lineHeight: 1.15,
          maxWidth: '700px',
          marginBottom: '1.25rem',
        }}>
          AI-Powered<br />
          <span style={{ color: 'var(--blue-light)' }}>Cyber Threat Reporter</span>
        </h1>

        <p style={{ color: 'var(--muted)', fontSize: '1.1rem', maxWidth: '520px', lineHeight: 1.7, marginBottom: '2.5rem' }}>
          Paste a log snippet or upload a file. Get instant AI-driven threat analysis with severity scoring and actionable remediation steps.
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to={user ? '/dashboard' : '/register'} style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ fontSize: '1rem', padding: '0.8rem 2rem' }}>
              {user ? 'Go to Dashboard' : 'Get Started'}
            </button>
          </Link>
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <button className="btn-secondary" style={{ fontSize: '1rem', padding: '0.8rem 2rem' }}>
              Sign In
            </button>
          </Link>
        </div>

        <div style={{ display: 'flex', gap: '2.5rem', marginTop: '4rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[['200+', 'Logs Analyzed'], ['4', 'Severity Levels'], ['Free', 'To Use']].map(([val, lbl]) => (
            <div key={lbl} style={{ textAlign: 'center' }}>
              <p style={{ color: 'var(--white)', fontSize: '1.6rem', fontWeight: 700 }}>{val}</p>
              <p style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>{lbl}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features — FIX 1: forced 2-col grid */}
      <section style={{ padding: '5rem 1.5rem', maxWidth: '900px', margin: '0 auto' }}>
        <SectionLabel>Features</SectionLabel>
        <h2 style={{ color: 'var(--white)', fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 700, marginBottom: '0.75rem' }}>
          Everything you need to triage threats fast
        </h2>
        <p style={{ color: 'var(--muted)', maxWidth: '520px', marginBottom: '3rem', lineHeight: 1.7 }}>
          A full-stack AI security tool that goes beyond simple keyword matching.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
          {FEATURES.map(f => (
            <div key={f.title} className="card">
              <span style={{ fontSize: '1.75rem', display: 'block', marginBottom: '0.75rem' }}>{f.icon}</span>
              <h3 style={{ color: 'var(--white)', fontWeight: 600, marginBottom: '0.5rem' }}>{f.title}</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '5rem 1.5rem', background: 'rgba(30,41,59,0.4)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <SectionLabel>How It Works</SectionLabel>
          <h2 style={{ color: 'var(--white)', fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 700, marginBottom: '3rem' }}>
            From log to report in seconds
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            {STEPS.map(s => (
              <div key={s.n} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <span style={{ color: 'var(--blue)', fontSize: '1.5rem', fontWeight: 700, fontFamily: 'monospace' }}>{s.n}</span>
                <h3 style={{ color: 'var(--white)', fontWeight: 600 }}>{s.title}</h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section style={{ padding: '5rem 1.5rem', maxWidth: '900px', margin: '0 auto' }}>
        <SectionLabel>Roadmap</SectionLabel>
        <h2 style={{ color: 'var(--white)', fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 700, marginBottom: '3rem' }}>
          Built iteratively, always improving
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {TIMELINE.map(col => (
            <div key={col.label} className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
                <span style={{
                  background: col.label === 'Implemented' ? 'rgba(34,197,94,0.15)' : 'rgba(59,130,246,0.15)',
                  color: col.label === 'Implemented' ? 'var(--green)' : 'var(--blue-light)',
                  border: col.label === 'Implemented' ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(59,130,246,0.3)',
                  borderRadius: '9999px',
                  padding: '0.2rem 0.75rem',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                }}>
                  {col.label === 'Implemented' ? 'Implemented' : 'Planned'}
                </span>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {col.items.map(item => (
                  <li key={item} style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                    <span style={{ color: col.label === 'Implemented' ? 'var(--green)' : 'var(--blue)', flexShrink: 0 }}>
                      {col.label === 'Implemented' ? '✓' : '○'}
                    </span>
                    <span style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: 1.5 }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section style={{ padding: '5rem 1.5rem', background: 'rgba(30,41,59,0.4)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <SectionLabel>About</SectionLabel>
          <h2 style={{ color: 'var(--white)', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, marginBottom: '1rem' }}>
            Built by a developer passionate about security
          </h2>
          <p style={{ color: 'var(--muted)', lineHeight: 1.8, marginBottom: '.5rem' }}>
            This project was built to explore the intersection of AI and cybersecurity. 
          </p>
          <p style={{ color: 'var(--muted)', lineHeight: 1.8, marginBottom: '2rem' }}>
            Combining modern LLMs with real threat detection patterns.
            It is open source, free to use, and continuously being improved.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://github.com/kpuentec/ai-threat-reporter" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
              <button className="btn-secondary">GitHub</button>
            </a>
            <a href="https://www.linkedin.com/in/kpcortez/" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
              <button className="btn-secondary">LinkedIn</button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '1.5rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>
          © {new Date().getFullYear()} AI Cyber Threat Reporter
        </p>
      </footer>
    </div>
  )
}

function SectionLabel({ children }) {
  return (
    <p style={{
      color: 'var(--blue-light)',
      fontSize: '0.78rem',
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      fontWeight: 600,
      marginBottom: '0.75rem',
    }}>
      {children}
    </p>
  )
}