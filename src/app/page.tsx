import Link from "next/link";

const FEATURES = [
  {
    tag: "Currency Bridge",
    title: "Convert NZD ⇄ PKR instantly",
    body: "Type an amount in either currency and see it converted live, using either your own rate or a real-time exchange rate — one tap away.",
    accent: "nz" as const,
  },
  {
    tag: "Loans, tracked properly",
    title: "Money you owe. Money you're owed.",
    body: "Log a loan you need to repay with its due date, or money you've lent someone with the date you expect it back. Overdue ones are flagged automatically.",
    accent: "pk" as const,
  },
  {
    tag: "Every category that matters",
    title: "Rent to remittances to the gym",
    body: "Rent, groceries, medical registration fees, family remittances, donations, fitness & equipment, study costs, insurance, savings — set a monthly budget for each.",
    accent: "nz" as const,
  },
  {
    tag: "Real accounts",
    title: "Your data, private and secure",
    body: "Sign up with your own account. Your expenses are stored securely and only ever visible to you — accessible from any device you sign in on.",
    accent: "pk" as const,
  },
  {
    tag: "See the shape of your money",
    title: "Charts that actually tell a story",
    body: "A category breakdown for this month and a 6-month spending trend, so you can see at a glance where your income is really going.",
    accent: "nz" as const,
  },
  {
    tag: "Always backed up",
    title: "Export your full history anytime",
    body: "Download your complete expense and budget history as a file whenever you want, on top of the secure account storage.",
    accent: "pk" as const,
  },
];

const STEPS = [
  {
    number: "01",
    title: "Create your account",
    body: "Sign up with your email — takes under a minute, no card required.",
  },
  {
    number: "02",
    title: "Set your budgets",
    body: "Add your monthly income and set a budget for each category that matters to you.",
  },
  {
    number: "03",
    title: "Log as you go",
    body: "Add expenses in NZD or PKR as they happen. Watch your budgets, charts, and loan due-dates update in real time.",
  },
];

export default function LandingPage() {
  return (
    <main className="relative overflow-hidden">
      {/* Ambient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -top-40 -left-32 h-[32rem] w-[32rem] rounded-full bg-nz/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -bottom-40 -right-32 h-[32rem] w-[32rem] rounded-full bg-pk/10 blur-3xl"
      />

      {/* Nav */}
      <nav className="relative max-w-6xl mx-auto px-4 md:px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-nz" />
          <span className="font-display text-lg font-medium">Fern &amp; Fifty</span>
          <span className="h-2 w-2 rounded-full bg-pk" />
        </div>
        <Link
          href="/login"
          className="text-sm border border-line rounded-md px-4 py-2 text-mist hover:text-ivory hover:border-mist transition-colors"
        >
          Sign in
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative max-w-4xl mx-auto px-4 md:px-6 pt-12 md:pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-mist mb-6 border border-line rounded-full px-4 py-1.5">
          <span className="text-nz">New Zealand</span>
          <span className="text-line">×</span>
          <span className="text-pk">Pakistan</span>
        </div>
        <h1 className="font-display text-4xl md:text-6xl font-medium leading-[1.1] mb-6">
          Your money, tracked
          <br />
          across two homes.
        </h1>
        <p className="text-mist text-base md:text-lg max-w-xl mx-auto mb-9 leading-relaxed">
          Built for people earning in one currency and living for two — track every
          expense, budget by category, follow loans you owe or are owed, and convert
          NZD to PKR without opening another app.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/login"
            className="rounded-md bg-nz text-ink font-semibold text-sm px-6 py-3 hover:brightness-110 transition"
          >
            Get started — it's free
          </Link>
          <Link
            href="/login"
            className="rounded-md border border-line text-ivory font-medium text-sm px-6 py-3 hover:border-mist transition"
          >
            I already have an account
          </Link>
        </div>
      </section>

      {/* Feature grid */}
      <section className="relative max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-16">
        <div className="text-center mb-12">
          <h2 className="font-display text-2xl md:text-3xl font-medium mb-3">
            Everything your budget actually needs
          </h2>
          <p className="text-mist text-sm max-w-lg mx-auto">
            Not a generic budgeting app repurposed for two currencies — built around
            how money actually moves between here and home.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-card border border-line bg-surface shadow-card p-6"
            >
              <div
                className={`text-xs font-semibold tracking-[0.14em] uppercase mb-3 ${
                  f.accent === "nz" ? "text-nz" : "text-pk"
                }`}
              >
                {f.tag}
              </div>
              <h3 className="font-display text-lg font-medium mb-2">{f.title}</h3>
              <p className="text-mist text-sm leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="relative max-w-4xl mx-auto px-4 md:px-6 py-10 md:py-16">
        <h2 className="font-display text-2xl md:text-3xl font-medium text-center mb-12">
          Up and running in three steps
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STEPS.map((s) => (
            <div key={s.number} className="text-center md:text-left">
              <div className="font-display text-4xl text-line mb-3">{s.number}</div>
              <h3 className="font-display text-lg font-medium mb-2">{s.title}</h3>
              <p className="text-mist text-sm leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative max-w-2xl mx-auto px-4 md:px-6 py-16 md:py-20 text-center">
        <h2 className="font-display text-2xl md:text-3xl font-medium mb-4">
          Start your ledger today
        </h2>
        <p className="text-mist text-sm mb-8">
          Free to use. Your data stays private to your account, always.
        </p>
        <Link
          href="/login"
          className="inline-block rounded-md bg-nz text-ink font-semibold text-sm px-7 py-3 hover:brightness-110 transition"
        >
          Create your account
        </Link>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-line">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-mist">
            <span className="h-1.5 w-1.5 rounded-full bg-nz" />
            <span>Fern &amp; Fifty</span>
            <span className="h-1.5 w-1.5 rounded-full bg-pk" />
          </div>
          <p className="text-mist text-xs">
            Built for two homes, two currencies, one clear ledger.
          </p>
        </div>
      </footer>
    </main>
  );
}
