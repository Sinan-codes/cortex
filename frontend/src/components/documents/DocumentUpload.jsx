import { useRef, useState } from 'react'
import { ApiError, uploadDocument } from '../../lib/api'

export default function DocumentUpload({ onUploaded }) {
  const inputRef = useRef(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState(null)

  async function handleFiles(files) {
    const file = files?.[0]
    if (!file) return

    setIsUploading(true)
    setError(null)
    try {
      const document = await uploadDocument(file)
      onUploaded(document)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Upload failed')
    } finally {
      setIsUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div>
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-700 bg-slate-900/30 px-6 py-10 text-center">
        <p className="text-sm text-slate-400">Upload a PDF, Markdown, or text file (max 25MB)</p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:opacity-50"
        >
          {isUploading ? 'Uploading…' : 'Choose File'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.txt,.md"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
      {error ? <p className="mt-2 text-sm text-red-400">{error}</p> : null}
    </div>
  )
}
