import { supabase } from './supabase'

const BASE_URL = import.meta.env.VITE_API_URL
async function authHeaders() {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('Not authenticated')
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session.access_token}`,
  }
}

async function handle(res) {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail || 'Request failed')
  }
  return res.json()
}

// text analyze / url analyze
export async function analyzeText(inputText) {
  const headers = await authHeaders()
  const res = await fetch(`${BASE_URL}/api/analyze`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ input_text: inputText }),
  })
  return handle(res)
}

// uploaded file analyze
export async function analyzeFile(file) {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('Not authenticated')

  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch(`${BASE_URL}/api/analyze/file`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${session.access_token}` },
    body: formData,
  })
  return handle(res)
}

// history
export async function getHistory(limit = 50) {
  const headers = await authHeaders()
  const res = await fetch(`${BASE_URL}/api/history?limit=${limit}`, { headers })
  return handle(res)
}

// stats
export async function getStats() {
  const headers = await authHeaders()
  const res = await fetch(`${BASE_URL}/api/stats`, { headers })
  return handle(res)
}