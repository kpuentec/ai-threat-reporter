import { useState } from 'react'

const STORAGE_KEY = 'noticeBannerDismissed'

function wasDismissed() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

export default function NoticeBanner() {
  const [visible, setVisible] = useState(() => !wasDismissed())

  if (!visible) return null

  const dismiss = () => {
    try {
      sessionStorage.setItem(STORAGE_KEY, '1')
    } catch {
      // storage blocked; still hide for this page view
    }
    setVisible(false)
  }

  return (
    <div
      role="status"
      className="w-full bg-yellow-400 text-slate-900"
      style={{
        padding: '0.5rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        fontSize: '0.9rem',
        fontWeight: 500,
      }}
    >
      <span>Heads up: we had some service issues earlier. We're back up. Thanks for your patience.</span>
      <button
        onClick={dismiss}
        aria-label="Dismiss notice"
        className="text-slate-900 hover:text-slate-700 cursor-pointer"
        style={{ background: 'none', border: 'none', fontSize: '1.25rem', lineHeight: 1, padding: '0 0.25rem' }}
      >
        ×
      </button>
    </div>
  )
}
