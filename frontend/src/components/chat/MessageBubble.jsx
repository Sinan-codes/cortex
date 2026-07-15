export default function MessageBubble({ message }) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[75%] rounded-xl px-4 py-3 text-sm ${
        isUser ? 'rounded-tr-sm bg-violet-600 text-white' : 'rounded-tl-sm bg-slate-800 text-slate-100'
      }`}
      >
        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>

        {message.citations?.length > 0 ? (
          <details className="mt-3 border-t border-slate-700 pt-2 text-xs text-slate-400">
            <summary className="cursor-pointer text-violet-300">
              {message.citations.length} source{message.citations.length > 1 ? 's' : ''}
            </summary>
            <ul className="mt-2 space-y-2">
              {message.citations.map((citation) => (
                <li key={citation.chunk_id} className="rounded-md bg-slate-900/60 p-2">
                  <p className="font-medium text-slate-300">
                    {citation.document_filename} · chunk {citation.chunk_index}
                  </p>
                  <p className="mt-1 line-clamp-3 text-slate-500">{citation.content}</p>
                </li>
              ))}
            </ul>
          </details>
        ) : null}
      </div>
    </div>
  )
}
