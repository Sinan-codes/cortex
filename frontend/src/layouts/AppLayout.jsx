import { NavLink, Outlet } from 'react-router'

const navLinkClass = ({ isActive }) =>
  `rounded-md px-3 py-1.5 text-sm font-medium transition ${
    isActive ? 'bg-violet-600 text-white' : 'text-slate-300 hover:text-white'
  }`

export default function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-slate-800/60 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <NavLink to="/" className="flex items-center gap-2 text-base font-semibold text-white">
            <img src="/android-chrome-192x192.png" alt="" className="h-7 w-7 rounded-lg" />
            Cortex
          </NavLink>

          <nav className="flex items-center gap-2">
            <NavLink to="/documents" className={navLinkClass}>
              Documents
            </NavLink>
            <NavLink to="/chat" className={navLinkClass}>
              Chat
            </NavLink>
          </nav>
        </div>
      </header>

      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  )
}
