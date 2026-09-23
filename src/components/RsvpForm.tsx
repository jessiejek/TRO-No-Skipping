"use client";

import { useState } from "react";
import type { RsvpStatus } from "@/lib/types";

const STATUSES: { value: RsvpStatus; label: string; hint: string }[] = [
  { value: "yes", label: "Yes", hint: "Looking forward to it" },
  { value: "no", label: "Can't make it", hint: "Won't make it" },
];

function noteRequiredFor(status: RsvpStatus): boolean {
  return status === "no";
}

export function RsvpForm() {
  const [name, setName] = useState("");
  const [status, setStatus] = useState<RsvpStatus | null>(null);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [submittedStatus, setSubmittedStatus] = useState<RsvpStatus | null>(
    null,
  );

  const noteRequired = status ? noteRequiredFor(status) : false;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!status) {
      setError("Please choose Yes or Can't make it.");
      return;
    }

    const trimmedNote = note.trim();
    if (noteRequired && !trimmedNote) {
      setError("Please leave a short note so we know you won't make it.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          status,
          note: trimmedNote || undefined,
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
      setSubmittedStatus(status);
      setDone(true);
      setName("");
      setNote("");
      setStatus(null);
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    const yes = submittedStatus === "yes";
    return (
      <div
        className="rounded-2xl border border-green-300 bg-green-50 p-5 sm:p-6"
        role="status"
      >
        <p className="text-lg font-semibold text-green-900">
          {yes
            ? "Thanks — you're in! ✅"
            : "Thanks for letting us know. ✅"}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-green-800/80">
          {yes
            ? "See you at the party. Wear shoes you can move in if you want to play."
            : "We'll miss you. Hope to catch you another time."}
        </p>
        <button
          type="button"
          onClick={() => {
            setDone(false);
            setSubmittedStatus(null);
          }}
          className="mt-4 min-h-12 w-full rounded-xl border border-green-400 bg-white px-4 text-base font-medium text-green-900 transition hover:bg-green-50 active:scale-[0.98] sm:w-auto sm:px-6"
        >
          Submit another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div>
        <label
          htmlFor="rsvp-name"
          className="mb-2 block text-sm font-medium text-green-900"
        >
          Full name
        </label>
        <input
          id="rsvp-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          maxLength={80}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="min-h-12 w-full rounded-xl border border-green-200 bg-green-50/50 px-4 text-base text-green-950 placeholder:text-green-700/35 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-300/60"
        />
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-green-900">
          Will you be there?
        </legend>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {STATUSES.map((s) => {
            const selected = status === s.value;
            return (
              <label
                key={s.value}
                className={[
                  "flex min-h-14 cursor-pointer flex-col justify-center rounded-xl border px-4 py-3 transition active:scale-[0.98]",
                  selected
                    ? "border-green-500 bg-green-200 text-green-950"
                    : "border-green-200 bg-green-50/80 text-green-900 hover:border-green-400 hover:bg-white",
                ].join(" ")}
              >
                <span className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="status"
                    value={s.value}
                    checked={selected}
                    onChange={() => setStatus(s.value)}
                    className="h-5 w-5 accent-green-600"
                  />
                  <span>
                    <span className="block text-base font-semibold">
                      {s.label}
                    </span>
                    <span
                      className={[
                        "block text-xs",
                        selected ? "text-green-800/70" : "text-green-700/45",
                      ].join(" ")}
                    >
                      {s.hint}
                    </span>
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {status === "yes" ? (
        <div
          className="rounded-xl border border-green-400/60 bg-green-100/70 px-4 py-3 text-sm leading-relaxed text-green-950"
          role="status"
        >
          <p className="font-semibold">Quick tip</p>
          <p className="mt-1 text-green-900/80">
            If you plan to play, bring comfortable shoes you can move in.
          </p>
        </div>
      ) : null}

      <div>
        <label
          htmlFor="rsvp-note"
          className="mb-2 block text-sm font-medium text-green-900"
        >
          Note{" "}
          {noteRequired ? (
            <span className="font-normal text-amber-800/80">(required)</span>
          ) : (
            <span className="font-normal text-green-700/45">(optional)</span>
          )}
        </label>
        <textarea
          id="rsvp-note"
          name="note"
          rows={3}
          maxLength={280}
          required={noteRequired}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={
            status === "yes"
              ? "Plus-ones, dietary needs, or anything we should know…"
              : "A short note is fine…"
          }
          className="w-full resize-y rounded-xl border border-green-200 bg-green-50/50 px-4 py-3 text-base text-green-950 placeholder:text-green-700/35 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-300/60"
        />
      </div>

      {error ? (
        <p
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={
          submitting ||
          !name.trim() ||
          !status ||
          (noteRequired && !note.trim())
        }
        className="min-h-14 w-full rounded-xl bg-green-600 px-6 text-base font-bold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]"
      >
        {submitting ? "Sending…" : "Submit RSVP"}
      </button>
    </form>
  );
}
