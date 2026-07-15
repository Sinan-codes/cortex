const features = [
  {
    title: 'Upload anything',
    description: 'Drop in PDFs, Word docs, or plain text. Cortex extracts and chunks the content automatically.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3.75 3.75 0 0 1 4.681 4.653A4.5 4.5 0 0 1 18 19.5H6.75Z" />
    ),
  },
  {
    title: 'Semantic search',
    description: 'Vector embeddings and pgvector similarity search find the most relevant passages, not just keyword matches.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    ),
  },
  {
    title: 'Cited answers',
    description: 'Every response links back to the exact document and passage it came from, so you can verify at a glance.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
    ),
  },
  {
    title: 'Built for speed',
    description: 'Async processing pipeline handles extraction, chunking, and embedding in the background so uploads stay fast.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5 12 3.75l8.25 9.75h-2.25v6a1.5 1.5 0 0 1-1.5 1.5h-9a1.5 1.5 0 0 1-1.5-1.5v-6H3.75Z" />
    ),
  },
]

export default function Features() {
  return (
    <section id="features" className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Everything you need to talk to your documents
          </h2>
          <p className="mt-4 text-slate-400">
            A focused feature set built around one job: turning a pile of files into fast, trustworthy answers.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 transition hover:border-slate-700 hover:bg-slate-900/70"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                  {feature.icon}
                </svg>
              </div>
              <h3 className="mt-4 text-base font-semibold text-white">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
