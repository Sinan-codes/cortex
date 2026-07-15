import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { createConversation, listDocuments } from '../lib/api'
import ConversationSidebar from '../components/conversations/ConversationSidebar'

export default function ConversationsPage() {
  const navigate = useNavigate()
  const [documents, setDocuments] = useState([])
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(true)
  const [title, setTitle] = useState('')
  const [selectedIds, setSelectedIds] = useState([])
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    listDocuments()
      .then(setDocuments)
      .finally(() => setIsLoadingDocuments(false))
  }, [])

  function toggleDocument(id) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setIsCreating(true)
    setError(null)
    try {
      const conversation = await createConversation({ title, documentIds: selectedIds })
      navigate(`/chat/${conversation.id}`)
    } catch {
      setError('Could not start conversation. Is the backend running?')
      setIsCreating(false)
    }
  }

  const readyDocuments = documents.filter((d) => d.status === 'ready')

  return (
    <div className="flex">
      <ConversationSidebar />

      <div className="mx-auto w-full max-w-xl px-6 py-12">
        <h1 className="text-2xl font-bold text-white">New conversation</h1>
        <p className="mt-1 text-sm text-slate-400">
          Pick which documents this conversation can search. Leave none selected to search everything.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-300">
              Title (optional)
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Q3 contracts review"
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none"
            />
          </div>

          <div>
            <p className="text-sm font-medium text-slate-300">Documents</p>
            <div className="mt-2 space-y-2">
              {isLoadingDocuments ? (
                <p className="text-sm text-slate-500">Loading…</p>
              ) : readyDocuments.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No ready documents yet — upload one on the Documents page first.
                </p>
              ) : (
                readyDocuments.map((document) => (
                  <label
                    key={document.id}
                    className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/40 px-3 py-2 text-sm text-slate-300"
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(document.id)}
                      onChange={() => toggleDocument(document.id)}
                      className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-violet-600 focus:ring-violet-500"
                    />
                    {document.filename}
                  </label>
                ))
              )}
            </div>
          </div>

          {error ? <p className="text-sm text-red-400">{error}</p> : null}

          <button
            type="submit"
            disabled={isCreating}
            className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:opacity-50"
          >
            {isCreating ? 'Starting…' : 'Start conversation'}
          </button>
        </form>
      </div>
    </div>
  )
}
