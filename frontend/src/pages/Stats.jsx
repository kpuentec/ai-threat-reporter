import { useState, useEffect } from 'react'
import { getStats, getHistory } from '../lib/api'

const SEVERITY_COLORS = {
  Critical: 'var(--red)',
  High: 'var(--orange)',
  Medium: 'var(--yellow)',
  Low: 'var(--green)',
  Unknown: 'var(--muted)',
  None: 'var(--muted)',
}

export default function Stats() {
  const [stats, setStats] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getStats(), getHistory(200)])
      .then(([s, h]) => { setStats(s); setHistory(h) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--muted)' }}>Loading stats...</div>

  const severityCounts = history.reduce((acc, h) => {
    acc[h.severity] = (acc[h.severity] || 0) + 1
    return acc
  }, {})

  const typeCounts = history.reduce((acc, h) => {
    acc[h.threat_type] = (acc[h.threat_type] || 0) + 1
    return acc
  }, {})
  const topTypes = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]).slice(0, 5)
  const maxTypeCount = topTypes[0]?.[1] || 1

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div className="animate-fadeIn">
        <h1 style={{ color: 'var(--white)', fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>Stats</h1>
        <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>Your threat analysis metrics at a glance.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <StatCard label="Total Analyses" value={stats?.total_analyses ?? 0} />
          <StatCard label="Today's Usage" value={`${stats?.daily_used ?? 0} / ${stats?.daily_limit ?? 0}`} />
          <StatCard label="Credits Remaining" value={stats?.daily_remaining ?? 0} highlight />
        </div>

        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ color: 'var(--white)', fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem' }}>Severity Breakdown</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {['Critical', 'High', 'Medium', 'Low', 'Unknown'].map(sev => {
              const count = severityCounts[sev] || 0
              const pct = history.length ? Math.round((count / history.length) * 100) : 0
              return (
                <div key={sev}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <span style={{ color: SEVERITY_COLORS[sev], fontSize: '0.85rem', fontWeight: 600 }}>{sev}</span>
                    <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>{count} ({pct}%)</span>
                  </div>
                  <div style={{ background: 'var(--surface2)', borderRadius: '9999px', height: '6px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: SEVERITY_COLORS[sev], borderRadius: '9999px', transition: 'width 0.6s ease' }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="card">
          <h2 style={{ color: 'var(--white)', fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem' }}>Top Threat Types</h2>
          {topTypes.length === 0 ? (
            <p style={{ color: 'var(--muted)' }}>No data yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {topTypes.map(([type, count]) => (
                <div key={type}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <span style={{ color: 'var(--white)', fontSize: '0.85rem' }}>{type}</span>
                    <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>{count}</span>
                  </div>
                  <div style={{ background: 'var(--surface2)', borderRadius: '9999px', height: '6px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.round((count / maxTypeCount) * 100)}%`, background: 'var(--blue)', borderRadius: '9999px', transition: 'width 0.6s ease' }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, highlight }) {
  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <p style={{ color: highlight ? 'var(--blue-light)' : 'var(--white)', fontSize: '2rem', fontWeight: 700 }}>{value}</p>
      <p style={{ color: 'var(--muted)', fontSize: '0.8rem', marginTop: '0.25rem' }}>{label}</p>
    </div>
  )
}