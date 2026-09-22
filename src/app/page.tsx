import Link from "next/link";
import { event } from "@/lib/event";
import { RsvpForm } from "@/components/RsvpForm";

export default function HomePage() {
  return (
    <div className="court-lines relative flex flex-1 flex-col">
      <header className="safe-pt safe-px mx-auto w-full max-w-lg pt-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-700">
            {event.brandName}
          </p>
          <Link
            href="/host"
            className="min-h-10 rounded-lg px-3 text-xs font-medium text-green-700/55 transition hover:text-green-900"
          >
            Host
          </Link>
        </div>
      </header>

      <main className="safe-px safe-pb mx-auto flex w-full max-w-lg flex-1 flex-col gap-8 pb-10 pt-6">
        <section className="space-y-4">
          <p className="inline-flex items-center gap-2 rounded-full border border-green-300 bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-800">
            <span aria-hidden>🎾</span> Pickleball summons
          </p>
          <h1 className="text-balance text-3xl font-bold leading-tight tracking-tight text-green-950 sm:text-4xl">
            {event.headline}
          </h1>
          <p className="text-pretty text-base leading-relaxed text-green-800/80 sm:text-lg">
            {event.subcopy}
          </p>
        </section>

        <section
          aria-labelledby="event-details"
          className="overflow-hidden rounded-2xl border border-green-200 bg-white shadow-sm"
        >
          <div className="border-b border-green-200 bg-green-100 px-4 py-3 sm:px-5">
            <h2
              id="event-details"
              className="text-sm font-semibold uppercase tracking-wider text-green-800"
            >
              Case file
            </h2>
          </div>
          <dl className="divide-y divide-green-100">
            <Detail label="Celebrant" value={`${event.celebrant} 🎂`} />
            <Detail label="Birthday" value={event.birthday} />
            <Detail label="When" value={`${event.partyDate}`} />
            <Detail label="Time" value={event.partyTime} />
            <Detail label="Where" value={event.venue} />
            <Detail label="Activity" value={event.activity} />
          </dl>
        </section>

        <section
          aria-labelledby="rsvp-heading"
          className="rounded-2xl border border-green-200 bg-white p-4 shadow-sm sm:p-6"
        >
          <h2
            id="rsvp-heading"
            className="mb-1 text-xl font-bold tracking-tight text-green-950"
          >
            RSVP
          </h2>
          <p className="mb-5 text-sm text-green-800/70">{event.cta}</p>
          <RsvpForm />
        </section>

        <footer className="pb-2 text-center text-xs text-green-700/50">
          <p>
            {event.brandName} · temporary joy, permanent vibes · no skipping
            serves
          </p>
        </footer>
      </main>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 px-4 py-3.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4 sm:px-5">
      <dt className="text-xs font-medium uppercase tracking-wider text-green-600">
        {label}
      </dt>
      <dd className="text-base font-medium text-green-950 sm:text-right">
        {value}
      </dd>
    </div>
  );
}
