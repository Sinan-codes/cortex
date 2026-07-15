import { useEffect, useState } from 'react'
import { NavLink } from 'react-router'
import { listConversations } from '../../lib/api'

export default function ConversationSidebar() {
  const [conversations, setConversations] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    listConversations()
      .then(setConversations)
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <aside className="w-64 shrink-0 border-r border-slate-800/60 px-4 py-6">
      <NavLink
        to="/chat"
        end
        className="block rounded-lg bg-violet-600 px-3 py-2 text-center text-sm font-semibold text-white transition hover:bg-violet-500"
      >
        New conversation
      </NavLink>

      <div className="mt-6 space-y-1">
        {isLoading ? (
          <p className="px-2 text-xs text-slate-500">Loading…</p>
        ) : conversations.length === 0 ? (
          <p className="px-2 text-xs text-slate-500">No conversations yet.</p>
        ) : (
          conversations.map((conversation) => (
            <NavLink
              key={conversation.id}
              to={`/chat/${conversation.id}`}
              className={({ isActive }) =>
                `block truncate rounded-md px-3 py-2 text-sm transition ${
                  isActive ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`
              }
            >
              {conversation.title || 'Untitled conversation'}
            </NavLink>
          ))
        )}
      </div>
    </aside>
  )
}
