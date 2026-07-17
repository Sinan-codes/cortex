import { useEffect, useState } from 'react'
import { NavLink } from 'react-router'
import { listConversations } from '../../lib/api'

export default function ConversationSidebar() {
  const [conversations, setConversations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    listConversations()
      .then(setConversations)
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Show conversations"
        className="fixed right-4 top-[72px] z-30 flex h-10 w-10 items-center justify-center rounded-full bg-violet-600 text-white shadow-lg shadow-black/40 md:hidden"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 shrink-0 overflow-y-auto border-r border-slate-800/60 bg-slate-950 px-4 py-6 transition-transform duration-200 md:static md:z-auto md:h-auto md:translate-x-0 md:shadow-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <NavLink
          to="/chat"
          end
          onClick={() => setIsOpen(false)}
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
                onClick={() => setIsOpen(false)}
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
    </>
  )
}
