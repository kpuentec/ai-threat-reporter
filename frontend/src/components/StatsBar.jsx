export default function StatsBar({ stats }) {
  if (!stats) return null

  const { daily_used, daily_limit, daily_remaining, total_analyses } = stats
  const pct = Math.round((daily_used / daily_limit) * 100)

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: '1rem',
      padding: '1rem 1.5rem',
      display: 'flex',
      gap: '2rem',
      alignItems: 'center',
      flexWrap: 'wrap',
      marginBottom: '1.5rem',
    }}>
      {/* Credits */}
      <div style={{ flex: 1, minWidth: '180px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
          <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>Daily Credits</span>
          <span style={{ color: 'var(--white)', fontSize: '0.8rem', fontWeight: 600 }}>
            {daily_used} / {daily_limit}
          </span>
        </div>
        <div style={{ background: 'var(--surface2)', borderRadius: '9999px', height: '6px', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${pct}%`,
            background: pct >= 90 ? 'var(--red)' : pct >= 70 ? 'var(--orange)' : 'var(--blue)',
            borderRadius: '9999px',
            transition: 'width 0.4s ease',
          }} />
        </div>
        <p style={{ color: 'var(--muted)', fontSize: '0.75rem', marginTop: '0.3rem' }}>
          {daily_remaining} remaining today
        </p>
      </div>

      {/* Divider */}
      <div style={{ width: '1px', height: '40px', background: 'var(--border)' }} />

      {/* Total */}
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: 'var(--white)', fontSize: '1.5rem', fontWeight: 700 }}>
          {total_analyses.toLocaleString()}
        </p>
        <p style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>Total Analyses Run</p>
      </div>
    </div>
  )
}