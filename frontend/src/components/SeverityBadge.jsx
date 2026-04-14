const SEVERITY_STYLES = {
  Low:      { background: 'rgba(34,197,94,0.15)',  color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)'  },
  Medium:   { background: 'rgba(234,179,8,0.15)',  color: '#eab308', border: '1px solid rgba(234,179,8,0.3)'  },
  High:     { background: 'rgba(249,115,22,0.15)', color: '#f97316', border: '1px solid rgba(249,115,22,0.3)' },
  Critical: { background: 'rgba(239,68,68,0.15)',  color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)'  },
  None:     { background: 'rgba(148,163,184,0.15)',color: '#94a3b8', border: '1px solid rgba(148,163,184,0.3)'},
  Unknown:  { background: 'rgba(148,163,184,0.15)',color: '#94a3b8', border: '1px solid rgba(148,163,184,0.3)'},
}

export default function SeverityBadge({ severity }) {
  const style = SEVERITY_STYLES[severity] || SEVERITY_STYLES.Unknown
  return (
    <span style={{
      ...style,
      borderRadius: '9999px',
      padding: '0.2rem 0.75rem',
      fontSize: '0.78rem',
      fontWeight: 600,
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
      display: 'inline-block',
    }}>
      {severity || 'Unknown'}
    </span>
  )
}