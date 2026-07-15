export default function Footer() {
  return (
    <footer className="border-t border-slate-800/60 px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <a href="#" className="flex items-center gap-2 text-sm font-semibold text-white">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-violet-600 text-xs font-bold">
            C
          </span>
          Cortex
        </a>
        <p className="text-sm text-slate-500">
          &copy; {new Date().getFullYear()} Cortex. Built with FastAPI, Postgres + pgvector, and React.
        </p>
      </div>
    </footer>
  )
}
