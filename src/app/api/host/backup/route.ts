// JJQR - AI (Oct 7, 2026): host-only RSVP backup download (CSV or JSON).
import { NextRequest, NextResponse } from "next/server";
import { isHostAuthenticated } from "@/lib/auth";
import { getAllRsvps } from "@/lib/rsvp-store";
import type { Rsvp } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// JJQR - AI (Oct 7, 2026): quote every cell, double inner quotes, and prefix
// formula-looking values with ' so spreadsheet apps don't execute them.
function csvCell(value: unknown): string {
  let s = value === undefined || value === null ? "" : String(value);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

function toCsv(rsvps: Rsvp[]): string {
  const header = ["name", "status", "note", "createdAt"];
  const rows = rsvps.map((r) =>
    [r.name, r.status, r.note ?? "", r.createdAt].map(csvCell).join(","),
  );
  // BOM so Excel opens names with accents/emoji correctly.
  return "\uFEFF" + [header.join(","), ...rows].join("\r\n") + "\r\n";
}

// JJQR - AI (Oct 7, 2026): e.g. 2026-10-07-2325 in Manila time.
function stamp(): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}-${get("hour")}${get("minute")}`;
}

export async function GET(request: NextRequest) {
  const ok = await isHostAuthenticated();
  if (!ok) {
    return NextResponse.json(
      { error: "Unauthorized. Host login required." },
      { status: 401 },
    );
  }

  const format =
    request.nextUrl.searchParams.get("format") === "json" ? "json" : "csv";

  let rsvps: Rsvp[];
  try {
    rsvps = await getAllRsvps();
  } catch (err) {
    console.error("RSVP backup failed:", err);
    return NextResponse.json(
      { error: "Could not read RSVPs for backup. Try again." },
      { status: 500 },
    );
  }

  const filename = `rsvps-backup-${stamp()}.${format}`;
  const body =
    format === "json" ? JSON.stringify(rsvps, null, 2) + "\n" : toCsv(rsvps);

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type":
        format === "json"
          ? "application/json; charset=utf-8"
          : "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
