const STATUS_STYLES = {
  pending: 'bg-slate-700/60 text-slate-300',
  processing: 'bg-blue-500/15 text-blue-300',
  ready: 'bg-emerald-500/15 text-emerald-300',
  failed: 'bg-red-500/15 text-red-300',
}

function formatSize(bytes) {
  if (!bytes) return ''
  const kb = bytes / 1024
  if (kb < 1) return `${bytes} B`
  if (kb < 1024) return `${kb < 10 ? kb.toFixed(1) : kb.toFixed(0)} KB`
  return `${(kb / 1024).toFixed(1)} MB`
}

export default function DocumentCard({ document, onDelete, isDeleting }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/40 px-5 py-4">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-white">{document.filename}</p>
        <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
          <span className={`rounded-full px-2 py-0.5 font-medium ${STATUS_STYLES[document.status]}`}>
            {document.status}
          </span>
          {document.size_bytes ? <span>{formatSize(document.size_bytes)}</span> : null}
        </div>
        {document.status === 'failed' && document.error_message ? (
          <p className="mt-1 truncate text-xs text-red-400">{document.error_message}</p>
        ) : null}
      </div>

      <button
        type="button"
        onClick={() => onDelete(document.id)}
        disabled={isDeleting}
        className="shrink-0 rounded-md px-2 py-1 text-xs font-medium text-slate-400 transition hover:bg-red-500/10 hover:text-red-300 disabled:opacity-50"
      >
        {isDeleting ? 'Deleting…' : 'Delete'}
      </button>
    </div>
  )
}
