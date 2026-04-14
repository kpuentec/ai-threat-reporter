import SeverityBadge from './SeverityBadge'

export default function ThreatCard({ result, animate = true }) {
  const { threat_type, severity, impact, remediation, vt_result, created_at } = result

  return (
    <div className={`card ${animate ? 'animate-fadeInUp' : ''}`} style={{ marginTop: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <p style={{ color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Threat Detected
          </p>
          <h3 style={{ color: 'var(--white)', fontSize: '1.2rem', fontWeight: 700 }}>
            {threat_type}
          </h3>
        </div>
        <SeverityBadge severity={severity} />
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '1rem 0' }} />

      {/* Impact */}
      <div style={{ marginBottom: '1rem' }}>
        <p style={{ color: 'var(--blue-light)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.35rem' }}>
          Impact
        </p>
        <p style={{ color: 'var(--white)', lineHeight: 1.6 }}>{impact}</p>
      </div>

      {/* Remediation */}
      <div style={{ marginBottom: vt_result ? '1rem' : 0 }}>
        <p style={{ color: 'var(--blue-light)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.35rem' }}>
          Remediation
        </p>
        <p style={{ color: 'var(--white)', lineHeight: 1.6 }}>{remediation}</p>
      </div>

      {/* VirusTotal result */}
      {vt_result && (
        <div style={{ marginTop: '1rem', background: 'var(--surface2)', borderRadius: '0.75rem', padding: '0.85rem 1rem' }}>
          <p style={{ color: 'var(--blue-light)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
            VirusTotal Scan
          </p>
          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
            <VTStat label="Malicious" value={vt_result.malicious} color="var(--red)" />
            <VTStat label="Suspicious" value={vt_result.suspicious} color="var(--orange)" />
            <VTStat label="Harmless" value={vt_result.harmless} color="var(--green)" />
            <VTStat label="Undetected" value={vt_result.undetected} color="var(--muted)" />
          </div>
        </div>
      )}

      {/* Timestamp */}
      {created_at && (
        <p style={{ color: 'var(--muted)', fontSize: '0.75rem', marginTop: '1rem', textAlign: 'right' }}>
          {new Date(created_at).toLocaleString()}
        </p>
      )}
    </div>
  )
}

function VTStat({ label, value, color }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <p style={{ color, fontWeight: 700, fontSize: '1.1rem', fontFamily: 'monospace' }}>{value}</p>
      <p style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>{label}</p>
    </div>
  )
}