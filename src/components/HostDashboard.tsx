"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Rsvp, RsvpStatus } from "@/lib/types";

type LoadState =
  | { kind: "loading" }
  | { kind: "need-login" }
  | { kind: "error"; message: string }
  | { kind: "ready"; rsvps: Rsvp[]; storage: string };

function StatusBadge({ status }: { status: RsvpStatus }) {
  const styles: Record<RsvpStatus, string> = {
    yes: "bg-green-100 text-green-800 border-green-300",
    maybe: "bg-amber-50 text-amber-800 border-amber-200",
    no: "bg-stone-100 text-stone-600 border-stone-300",
  };
  const labels: Record<RsvpStatus, string> = {
    yes: "Yes",
    maybe: "Maybe",
    no: "No",
  };
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

function formatWhen(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-PH", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Manila",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function HostDashboard() {
  const [state, setState] = useState<LoadState>({ kind: "loading" });
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  const load = useCallback(async () => {
    setState({ kind: "loading" });
    try {
      const res = await fetch("/api/rsvp", { cache: "no-store" });
      if (res.status === 401) {
        setState({ kind: "need-login" });
        return;
      }
      const data = (await res.json()) as {
        error?: string;
        rsvps?: Rsvp[];
        storage?: string;
      };
      if (!res.ok) {
        setState({
          kind: "error",
          message: data.error || "Failed to load RSVPs",
        });
        return;
      }
      setState({
        kind: "ready",
        rsvps: data.rsvps ?? [],
        storage: data.storage ?? "local",
      });
    } catch {
      setState({ kind: "error", message: "Network error loading RSVPs." });
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const counts = useMemo(() => {
    if (state.kind !== "ready") return { yes: 0, maybe: 0, no: 0, total: 0 };
    const yes = state.rsvps.filter((r) => r.status === "yes").length;
    const maybe = state.rsvps.filter((r) => r.status === "maybe").length;
    const no = state.rsvps.filter((r) => r.status === "no").length;
    return { yes, maybe, no, total: state.rsvps.length };
  }, [state]);

  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError(null);
    setLoggingIn(true);
    try {
      const res = await fetch("/api/host/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setLoginError(data.error || "Login failed");
        return;
      }
      setPassword("");
      await load();
    } catch {
      setLoginError("Network error.");
    } finally {
      setLoggingIn(false);
    }
  }

  async function onLogout() {
    await fetch("/api/host/logout", { method: "POST" });
    setState({ kind: "need-login" });
  }

  if (state.kind === "loading") {
    return (
      <p className="text-center text-green-700/60" role="status">
        Checking credentials…
      </p>
    );
  }

  if (state.kind === "need-login") {
    return (
      <form
        onSubmit={onLogin}
        className="mx-auto w-full max-w-sm space-y-4 rounded-2xl border border-green-200 bg-white p-5 shadow-sm"
      >
        <div>
          <label
            htmlFor="host-password"
            className="mb-2 block text-sm font-medium text-green-900"
          >
            Host password
          </label>
          <input
            id="host-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="min-h-12 w-full rounded-xl border border-green-200 bg-green-50/50 px-4 text-base text-green-950 outline-none focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-300/60"
            placeholder="••••••••"
          />
        </div>
        {loginError ? (
          <p className="text-sm text-red-600" role="alert">
            {loginError}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={loggingIn || !password}
          className="min-h-12 w-full rounded-xl bg-green-600 text-base font-bold text-white disabled:opacity-50"
        >
          {loggingIn ? "Logging in…" : "Log in"}
        </button>
      </form>
    );
  }

  if (state.kind === "error") {
    return (
      <div className="space-y-4 text-center">
        <p className="text-red-600">{state.message}</p>
        <button
          type="button"
          onClick={() => void load()}
          className="min-h-12 rounded-xl border border-green-300 px-6 text-green-900"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-green-800/70">
          Storage:{" "}
          <span className="font-mono text-green-700">{state.storage}</span>
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => void load()}
            className="min-h-11 rounded-xl border border-green-300 bg-white px-4 text-sm font-medium text-green-900 hover:bg-green-50"
          >
            Refresh
          </button>
          <button
            type="button"
            onClick={() => void onLogout()}
            className="min-h-11 rounded-xl border border-green-300 bg-white px-4 text-sm font-medium text-green-900 hover:bg-green-50"
          >
            Log out
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total", value: counts.total },
          { label: "Yes", value: counts.yes },
          { label: "Maybe", value: counts.maybe },
          { label: "No", value: counts.no },
        ].map((c) => (
          <div
            key={c.label}
            className="rounded-2xl border border-green-200 bg-white p-4 text-center shadow-sm"
          >
            <p className="text-2xl font-bold text-green-700 tabular-nums">
              {c.value}
            </p>
            <p className="mt-1 text-xs uppercase tracking-wider text-green-600/70">
              {c.label}
            </p>
          </div>
        ))}
      </div>

      {state.rsvps.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-green-300 bg-white/70 p-8 text-center text-green-700/70">
          No RSVPs yet. Share the invite link!
        </p>
      ) : (
        <ul className="space-y-3">
          {state.rsvps.map((r) => (
            <li
              key={r.id}
              className="rounded-2xl border border-green-200 bg-white p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-base font-semibold text-green-950">
                    {r.name}
                  </p>
                  <p className="mt-0.5 text-xs text-green-700/55">
                    {formatWhen(r.createdAt)}
                  </p>
                </div>
                <StatusBadge status={r.status} />
              </div>
              {r.note ? (
                <p className="mt-3 text-sm leading-relaxed text-green-800/80">
                  {r.note}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
