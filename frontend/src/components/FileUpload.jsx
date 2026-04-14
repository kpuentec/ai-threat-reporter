import { useState, useRef } from 'react'

export default function FileUpload({ onFile, disabled }) {
  const [dragging, setDragging] = useState(false)
  const [selected, setSelected] = useState(null)
  const inputRef = useRef()

  const handleFile = (file) => {
    if (!file) return
    if (!file.name.endsWith('.txt') && !file.name.endsWith('.log')) {
      alert('Only .txt and .log files are supported.')
      return
    }
    setSelected(file)
    onFile(file)
  }

  return (
    <div
      onClick={() => !disabled && inputRef.current.click()}
      onDragOver={e => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={e => {
        e.preventDefault()
        setDragging(false)
        handleFile(e.dataTransfer.files[0])
      }}
      style={{
        border: `2px dashed ${dragging ? 'var(--blue)' : 'var(--border)'}`,
        borderRadius: '1rem',
        padding: '2rem',
        textAlign: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        background: dragging ? 'rgba(59,130,246,0.05)' : 'var(--surface2)',
        transition: 'all 0.2s ease',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".txt,.log"
        style={{ display: 'none' }}
        onChange={e => handleFile(e.target.files[0])}
        disabled={disabled}
      />
      <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📂</p>
      {selected ? (
        <>
          <p style={{ color: 'var(--blue-light)', fontWeight: 600 }}>{selected.name}</p>
          <p style={{ color: 'var(--muted)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
            {(selected.size / 1024).toFixed(1)} KB — click to change
          </p>
        </>
      ) : (
        <>
          <p style={{ color: 'var(--white)', fontWeight: 600 }}>Drop a log file here</p>
          <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            .txt or .log — up to 200 lines
          </p>
        </>
      )}
    </div>
  )
}