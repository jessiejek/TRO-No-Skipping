import Link from "next/link";
import { event } from "@/lib/event";
import { HostDashboard } from "@/components/HostDashboard";

export const metadata = {
  title: `Host — ${event.brandName}`,
  robots: { index: false, follow: false },
};

export default function HostPage() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="safe-pt safe-px mx-auto w-full max-w-2xl pt-4">
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/"
            className="min-h-10 text-sm font-medium text-green-700/70 hover:text-green-900"
          >
            ← Invite
          </Link>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-700">
            Host docket
          </p>
        </div>
      </header>

      <main className="safe-px safe-pb mx-auto w-full max-w-2xl flex-1 pb-10 pt-6">
        <h1 className="mb-2 text-2xl font-bold tracking-tight text-green-950 sm:text-3xl">
          RSVP chambers
        </h1>
        <p className="mb-8 text-sm text-green-800/70">
          Private view of responses for {event.celebrant}&apos;s party. Password
          required.
        </p>
        <HostDashboard />
      </main>
    </div>
  );
}
