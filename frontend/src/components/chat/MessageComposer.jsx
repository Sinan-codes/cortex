import { useState } from 'react'

export default function MessageComposer({ onSend, isSending }) {
  const [value, setValue] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const content = value.trim()
    if (!content || isSending) return
    setValue('')
    onSend(content)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-3 border-t border-slate-800/60 px-6 py-4">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={1}
        placeholder="Ask a question about your documents…"
        className="flex-1 resize-none rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none"
      />
      <button
        type="submit"
        disabled={isSending || !value.trim()}
        className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:opacity-50"
      >
        {isSending ? 'Sending…' : 'Send'}
      </button>
    </form>
  )
}
