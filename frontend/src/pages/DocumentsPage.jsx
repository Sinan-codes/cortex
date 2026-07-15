import { useState } from 'react'
import { useDocuments } from '../hooks/useDocuments'
import { deleteDocument } from '../lib/api'
import DocumentUpload from '../components/documents/DocumentUpload'
import DocumentCard from '../components/documents/DocumentCard'

export default function DocumentsPage() {
  const { documents, isLoading, error, addDocument, removeDocument } = useDocuments()
  const [deletingId, setDeletingId] = useState(null)

  async function handleDelete(id) {
    setDeletingId(id)
    try {
      await deleteDocument(id)
      removeDocument(id)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-bold text-white">Documents</h1>
      <p className="mt-1 text-sm text-slate-400">
        Upload documents here, then start a chat scoped to any of them.
      </p>

      <div className="mt-8">
        <DocumentUpload onUploaded={addDocument} />
      </div>

      <div className="mt-8 space-y-3">
        {isLoading ? (
          <p className="text-sm text-slate-500">Loading…</p>
        ) : error ? (
          <p className="text-sm text-red-400">Couldn't load documents. Is the backend running?</p>
        ) : documents.length === 0 ? (
          <p className="text-sm text-slate-500">No documents yet — upload one to get started.</p>
        ) : (
          documents.map((document) => (
            <DocumentCard
              key={document.id}
              document={document}
              onDelete={handleDelete}
              isDeleting={deletingId === document.id}
            />
          ))
        )}
      </div>
    </div>
  )
}
