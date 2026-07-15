import { Link } from 'react-router'

export default function CTA() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-4xl rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-600/20 via-slate-900 to-slate-900 px-6 py-14 text-center sm:px-14">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Ready to talk to your documents?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-slate-400">
          Upload a file and ask your first question in under a minute. No setup, no fuss.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            to="/documents"
            className="w-full rounded-lg bg-violet-600 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-violet-500 sm:w-auto"
          >
            Get Started for Free
          </Link>
        </div>
      </div>
    </section>
  )
}
