const steps = [
  {
    number: '01',
    title: 'Upload your documents',
    description: 'Drag in PDFs, Word docs, or text files. Cortex extracts and splits the content into searchable chunks.',
  },
  {
    number: '02',
    title: 'Ask a question',
    description: 'Type a question in plain English, just like chatting with a colleague who read everything for you.',
  },
  {
    number: '03',
    title: 'Get a cited answer',
    description: 'Cortex retrieves the most relevant passages and generates an answer with links back to the source.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">How it works</h2>
          <p className="mt-4 text-slate-400">Three steps from raw files to a real answer.</p>
        </div>

        <div className="relative mt-14 grid grid-cols-1 gap-10 sm:grid-cols-3">
          <div className="pointer-events-none absolute top-6 left-0 right-0 hidden h-px bg-slate-800 sm:block" />

          {steps.map((step) => (
            <div key={step.number} className="relative flex flex-col items-center text-center sm:items-start sm:text-left">
              <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-violet-500/40 bg-slate-950 text-sm font-semibold text-violet-300">
                {step.number}
              </span>
              <h3 className="mt-4 text-base font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
