const BASE_URL = import.meta.env.VITE_API_BASE_URL

export class ApiError extends Error {
  constructor(status, detail) {
    super(typeof detail === 'string' ? detail : 'Request failed')
    this.status = status
  }
}

async function apiFetch(path, init) {
  const res = await fetch(`${BASE_URL}${path}`, { ...init, credentials: 'include' })
  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new ApiError(res.status, body?.detail)
  }
  if (res.status === 204) return null
  return res.json()
}

export function listDocuments() {
  return apiFetch('/documents')
}

export function uploadDocument(file) {
  const formData = new FormData()
  formData.append('file', file)
  return apiFetch('/documents', { method: 'POST', body: formData })
}

export function deleteDocument(id) {
  return apiFetch(`/documents/${id}`, { method: 'DELETE' })
}

export function listConversations() {
  return apiFetch('/conversations')
}

export function createConversation({ title, documentIds }) {
  return apiFetch('/conversations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: title || null, document_ids: documentIds }),
  })
}

export function listMessages(conversationId) {
  return apiFetch(`/conversations/${conversationId}/messages`)
}

export function sendMessage(conversationId, content) {
  return apiFetch(`/conversations/${conversationId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  })
}
