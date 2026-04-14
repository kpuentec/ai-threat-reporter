import { useState, useEffect } from 'react'
import StatsBar from '../components/StatsBar'
import ThreatCard from '../components/ThreatCard'
import FileUpload from '../components/FileUpload'
import { analyzeText, analyzeFile, getStats } from '../lib/api'
import { useAuth } from '../context/useAuth'

const TABS = ['Text / URL', 'Log File']
const MAX_CHARS = 5000

export default function Dashboard() {
  const { user } = useAuth()
  const [tab, setTab] = useState(0)
  const [input, setInput] = useState('')
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)
  const [fileResult, setFileResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [stats, setStats] = useState(null)

  const fetchStats = async () => {
    try { setStats(await getStats()) } catch {}
  }

  useEffect(() => { fetchStats() }, [])

  const handleAnalyzeText = async () => {
    if (!input.trim()) { setError('Please enter some text.'); return }
    if (input.length > MAX_CHARS) { setError(`Max ${MAX_CHARS} characters.`); return }
    setError('')
    setLoading(true)
    setResult(null)
    try {
      const data = await analyzeText(input)
      setResult(data)
      fetchStats()
    } catch (e) { setError(e.message) }
    setLoading(false)
  }

  const handleAnalyzeFile = async () => {
    if (!file) { setError('Please select a file.'); return }
    setError('')
    setLoading(true)
    setFileResult(null)
    try {
      const data = await analyzeFile(file)
      setFileResult(data)
      fetchStats()
    } catch (e) { setError(e.message) }
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div className="animate-fadeIn">
        <h1 style={{ color: 'var(--white)', fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>
          Dashboard
        </h1>
        <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>
          Analyze logs, snippets, or URLs for cyber threats.
        </p>

        <StatsBar stats={stats} />

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
          {TABS.map((t, i) => (
            <button key={t} onClick={() => { setTab(i); setError(''); setResult(null); setFileResult(null) }}
              style={{
                background: tab === i ? 'var(--blue)' : 'var(--surface)',
                color: tab === i ? '#fff' : 'var(--muted)',
                border: '1px solid var(--border)',
                borderRadius: '9999px',
                padding: '0.4rem 1.1rem',
                fontSize: '0.85rem',
                cursor: 'pointer',
                fontFamily: 'Georgia, serif',
                boxShadow: tab === i ? '0 4px 12px rgba(59,130,246,0.3)' : 'none',
                transition: 'all 0.2s',
              }}>
              {t}
            </button>
          ))}
        </div>

        <div className="card">
          {tab === 0 ? (
            <>
              <label style={{ color: 'var(--muted)', fontSize: '0.85rem', display: 'block', marginBottom: '0.5rem' }}>
                Paste a log snippet or URL
              </label>
              <textarea
                className="input"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="e.g. Multiple failed login attempts from 192.168.1.1..."
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
                <span style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>{input.length} / {MAX_CHARS}</span>
                <button className="btn-primary" onClick={handleAnalyzeText} disabled={loading}>
                  {loading ? 'Analyzing...' : 'Analyze'}
                </button>
              </div>
            </>
          ) : (
            <>
              <FileUpload onFile={setFile} disabled={loading} />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button className="btn-primary" onClick={handleAnalyzeFile} disabled={loading || !file}>
                  {loading ? 'Analyzing...' : 'Analyze File'}
                </button>
              </div>
            </>
          )}
        </div>

        {error && (
          <p style={{ color: 'var(--red)', background: 'rgba(239,68,68,0.1)', padding: '0.75rem 1rem', borderRadius: '0.75rem', marginTop: '1rem', fontSize: '0.9rem' }}>
            {error}
          </p>
        )}

        {result && <ThreatCard result={result} />}

        {fileResult && (
          <div className="animate-fadeInUp" style={{ marginTop: '1.5rem' }}>
            <div className="card" style={{ marginBottom: '1rem', background: 'var(--surface2)' }}>
              <p style={{ color: 'var(--white)', fontWeight: 600 }}>📄 {fileResult.filename}</p>
              <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                {fileResult.lines_processed} lines processed · {fileResult.chunks_analyzed} chunks analyzed
              </p>
            </div>
            {fileResult.results?.map((r, i) => (
              <ThreatCard key={i} result={r} animate={false} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}