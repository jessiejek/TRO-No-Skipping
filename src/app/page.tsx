import Link from "next/link";
import { event } from "@/lib/event";
import { RsvpForm } from "@/components/RsvpForm";

export default function HomePage() {
  return (
    <div className="relative flex flex-1 flex-col bg-white">
      {/* JJQR - AI (Oct 7, 2026) */}
      <div className="bg-[#1E3932] pb-10">
        <header className="safe-pt safe-px mx-auto w-full max-w-lg pt-4">
          <div className="flex items-center justify-end gap-3">
            {/* JJQR - AI (Oct 7, 2026) */}
            <Link
              href="/host"
              className="min-h-10 rounded-lg px-3 text-xs font-medium text-white/70 transition hover:text-white"
            >
              Host
            </Link>
          </div>
        </header>

        <div className="safe-px mx-auto w-full max-w-lg pt-8">
          <section className="space-y-4">
            {/* JJQR - AI (Oct 7, 2026) */}
            <p className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-base font-bold text-[#1E3932]">
              <svg aria-hidden viewBox="0 0 24 24" className="h-7 w-7">
                <g transform="rotate(-30 10 12)">
                  <rect
                    x="4"
                    y="1"
                    width="12"
                    height="14"
                    rx="4"
                    fill="#CBA258"
                    stroke="#1E3932"
                    strokeWidth="1"
                  />
                  <rect
                    x="8.25"
                    y="14.5"
                    width="3.5"
                    height="7.5"
                    rx="1.2"
                    fill="#1E3932"
                  />
                  <path
                    d="M8.25 17h3.5M8.25 19h3.5"
                    stroke="#ffffff"
                    strokeWidth="0.5"
                  />
                </g>
                <circle
                  cx="19.3"
                  cy="18.3"
                  r="3.9"
                  fill="#E3F22B"
                  stroke="#1E3932"
                  strokeWidth="0.6"
                />
                <circle cx="19.3" cy="18.3" r="0.5" fill="#1E3932" />
                <circle cx="21.5" cy="18.3" r="0.5" fill="#1E3932" />
                <circle cx="20.4" cy="20.2" r="0.5" fill="#1E3932" />
                <circle cx="18.2" cy="20.2" r="0.5" fill="#1E3932" />
                <circle cx="17.1" cy="18.3" r="0.5" fill="#1E3932" />
                <circle cx="18.2" cy="16.4" r="0.5" fill="#1E3932" />
                <circle cx="20.4" cy="16.4" r="0.5" fill="#1E3932" />
              </svg>
              {" "}Pickleball Birthday
            </p>
            {/* JJQR - AI (Oct 7, 2026) */}
            <h1 className="text-balance text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
              {event.headline}
            </h1>
            {/* JJQR - AI (Oct 7, 2026) */}
            <p className="text-pretty text-base leading-relaxed text-white/85 sm:text-lg">
              {event.subcopy}
            </p>
          </section>
        </div>
      </div>

      <main className="safe-px safe-pb mx-auto flex w-full max-w-lg flex-1 flex-col gap-8 pb-10 pt-6">
        <section
          aria-labelledby="event-details"
          className="overflow-hidden rounded-2xl border border-green-200 bg-white shadow-sm"
        >
          <div className="border-b border-green-200 bg-green-100 px-4 py-3 sm:px-5">
            <h2
              id="event-details"
              className="text-sm font-semibold uppercase tracking-wider text-green-800"
            >
              Details
            </h2>
          </div>
          <dl className="divide-y divide-green-100">
            <Detail label="Celebrant" value={event.celebrant} />
            <Detail label="When" value={`${event.partyDate}`} />
            <Detail label="Time" value={event.partyTime} />
            <Detail label="Where" value={event.venue} />
            <Detail label="Bring (optional)" value={event.bring} />
          </dl>
        </section>

        <section
          aria-labelledby="rsvp-heading"
          className="rounded-2xl border border-green-200 bg-white p-4 shadow-sm sm:p-6"
        >
          <h2
            id="rsvp-heading"
            className="mb-5 text-xl font-bold tracking-tight text-green-950"
          >
            RSVP
          </h2>
          <RsvpForm />
        </section>

        <footer className="pb-2 text-center text-xs text-green-700/50">
          <p>
            {event.brandName} · no skipping
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
