import { useState, useEffect } from 'react'
import { getHistory } from '../lib/api'
import SeverityBadge from '../components/SeverityBadge'
import ThreatCard from '../components/ThreatCard'

const SEVERITY_ORDER = { Critical: 0, High: 1, Medium: 2, Low: 3, Unknown: 4, None: 5 }
const FILTERS = ['All', 'Critical', 'High', 'Medium', 'Low']

export default function History() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const [expanded, setExpanded] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getHistory(100)
      .then(setHistory)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const filtered = history
    .filter(h => filter === 'All' || h.severity === filter)
    .sort((a, b) => (SEVERITY_ORDER[a.severity] ?? 5) - (SEVERITY_ORDER[b.severity] ?? 5))

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div className="animate-fadeIn">
        <h1 style={{ color: 'var(--white)', fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>History</h1>
        <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>Your past threat analyses, sorted by severity.</p>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{
                background: filter === f ? 'var(--blue)' : 'var(--surface)',
                color: filter === f ? '#fff' : 'var(--muted)',
                border: '1px solid var(--border)',
                borderRadius: '9999px',
                padding: '0.35rem 1rem',
                fontSize: '0.82rem',
                cursor: 'pointer',
                fontFamily: 'Georgia, serif',
                boxShadow: filter === f ? '0 4px 12px rgba(59,130,246,0.3)' : 'none',
                transition: 'all 0.2s',
              }}>
              {f}
            </button>
          ))}
        </div>

        {loading && <p style={{ color: 'var(--muted)' }}>Loading history...</p>}
        {error && <p style={{ color: 'var(--red)' }}>{error}</p>}

        {!loading && filtered.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📭</p>
            <p style={{ color: 'var(--muted)' }}>No analyses found{filter !== 'All' ? ` for severity: ${filter}` : ''}.</p>
          </div>
        )}

        {filtered.map((item, i) => (
          <div key={item.id} style={{ marginBottom: '0.75rem' }}>
            <div
              className="card"
              onClick={() => setExpanded(expanded === i ? null : i)}
              style={{ cursor: 'pointer', padding: '1rem 1.25rem' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1, minWidth: 0 }}>
                  <SeverityBadge severity={item.severity} />
                  <span style={{ color: 'var(--white)', fontWeight: 600, fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.threat_type}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ color: 'var(--muted)', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                  <span style={{ color: 'var(--blue-light)', fontSize: '0.85rem' }}>
                    {expanded === i ? '▲' : '▼'}
                  </span>
                </div>
              </div>

              <p style={{ color: 'var(--muted)', fontSize: '0.8rem', marginTop: '0.5rem', fontFamily: 'monospace', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {item.input_text}
              </p>
            </div>

            {expanded === i && (
              <div style={{ marginTop: '0.25rem' }}>
                <ThreatCard result={item} animate={false} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}