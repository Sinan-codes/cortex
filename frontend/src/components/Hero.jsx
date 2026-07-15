import { Link } from 'react-router'

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-16 sm:pt-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex justify-center">
        <div className="h-72 w-[36rem] rounded-full bg-violet-600/20 blur-3xl" />
      </div>

      <div className="mx-auto flex max-w-6xl flex-col items-center gap-12 lg:flex-row">
        <div className="max-w-xl text-center lg:text-left">
          <span className="inline-flex items-center rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300">
            AI-powered document search
          </span>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Chat with your documents, get answers with{' '}
            <span className="text-violet-400">receipts</span>
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-slate-400">
            Upload PDFs, docs, and notes. Cortex turns them into a searchable
            knowledge base and answers your questions in plain English —
            every answer cited back to the exact source.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
            <Link
              to="/documents"
              className="rounded-lg bg-violet-600 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-violet-500"
            >
              Get Started
            </Link>
            <a
              href="#how-it-works"
              className="rounded-lg border border-slate-700 px-6 py-3 text-center text-sm font-semibold text-slate-200 transition hover:border-slate-500"
            >
              See how it works
            </a>
          </div>
        </div>

        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-2xl shadow-violet-950/40">
            <div className="flex items-center gap-1.5 border-b border-slate-800 pb-3">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
            </div>

            <div className="space-y-3 pt-4">
              <div className="ml-auto max-w-[80%] rounded-lg rounded-tr-sm bg-violet-600 px-3 py-2 text-sm text-white">
                What's our refund policy for enterprise plans?
              </div>
              <div className="max-w-[85%] space-y-2 rounded-lg rounded-tl-sm bg-slate-800 px-3 py-2 text-sm text-slate-200">
                <p>
                  Enterprise plans include a 30-day money-back guarantee,
                  prorated after that.
                </p>
                <div className="flex items-center gap-1.5 border-t border-slate-700 pt-2 text-xs text-violet-300">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 12-3-3m0 0-3 3m3-3v6" />
                  </svg>
                  contracts.pdf, p.4
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
