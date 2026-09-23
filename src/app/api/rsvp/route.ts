import { NextRequest, NextResponse } from "next/server";
import { isHostAuthenticated } from "@/lib/auth";
import { addRsvp, deleteRsvp, getAllRsvps, storageMode } from "@/lib/rsvp-store";
import type { RsvpStatus } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID_STATUS = new Set<RsvpStatus>(["yes", "no"]);

export async function GET() {
  const ok = await isHostAuthenticated();
  if (!ok) {
    return NextResponse.json(
      { error: "Unauthorized. Host login required." },
      { status: 401 },
    );
  }

  const rsvps = await getAllRsvps();
  return NextResponse.json({
    rsvps,
    storage: storageMode(),
    count: rsvps.length,
  });
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { name, status, note } = body as {
    name?: unknown;
    status?: unknown;
    note?: unknown;
  };

  if (typeof name !== "string" || name.trim().length < 1) {
    return NextResponse.json(
      { error: "Name is required (at least 1 character)." },
      { status: 400 },
    );
  }
  if (name.trim().length > 80) {
    return NextResponse.json(
      { error: "Name must be 80 characters or fewer." },
      { status: 400 },
    );
  }
  if (typeof status !== "string" || !VALID_STATUS.has(status as RsvpStatus)) {
    return NextResponse.json(
      { error: "Status must be yes or no." },
      { status: 400 },
    );
  }
  if (note !== undefined && note !== null && typeof note !== "string") {
    return NextResponse.json({ error: "Note must be a string." }, { status: 400 });
  }
  if (typeof note === "string" && note.length > 280) {
    return NextResponse.json(
      { error: "Note must be 280 characters or fewer." },
      { status: 400 },
    );
  }

  const statusValue = status as RsvpStatus;
  const noteText =
    typeof note === "string" ? note.trim() : "";
  if (statusValue === "no" && noteText.length < 1) {
    return NextResponse.json(
      { error: "A note is required when you can't make it." },
      { status: 400 },
    );
  }

  try {
    const rsvp = await addRsvp({
      name: name.trim(),
      status: statusValue,
      note: noteText || undefined,
    });
    return NextResponse.json({ rsvp }, { status: 201 });
  } catch (err) {
    console.error("RSVP save failed:", err);
    const onVercel = Boolean(process.env.VERCEL);
    const hasBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
    if (onVercel && !hasBlob) {
      return NextResponse.json(
        {
          error:
            "Production storage is not set up. Add BLOB_READ_WRITE_TOKEN in Vercel (Storage → Blob), then redeploy.",
        },
        { status: 503 },
      );
    }
    return NextResponse.json(
      { error: "Could not save RSVP. Try again." },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  const ok = await isHostAuthenticated();
  if (!ok) {
    return NextResponse.json(
      { error: "Unauthorized. Host login required." },
      { status: 401 },
    );
  }

  let id: string | undefined = request.nextUrl.searchParams.get("id") ?? undefined;

  if (!id) {
    try {
      const body = await request.json();
      if (body && typeof body === "object" && "id" in body) {
        const raw = (body as { id?: unknown }).id;
        if (typeof raw === "string") id = raw;
      }
    } catch {
      // no / invalid JSON body — fall through to validation
    }
  }

  if (typeof id !== "string" || id.trim().length < 1) {
    return NextResponse.json(
      { error: "id is required (non-empty string)." },
      { status: 400 },
    );
  }

  try {
    const removed = await deleteRsvp(id.trim());
    if (!removed) {
      return NextResponse.json({ error: "RSVP not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("RSVP delete failed:", err);
    const onVercel = Boolean(process.env.VERCEL);
    const hasBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
    if (onVercel && !hasBlob) {
      return NextResponse.json(
        {
          error:
            "Production storage is not set up. Add BLOB_READ_WRITE_TOKEN in Vercel (Storage → Blob), then redeploy.",
        },
        { status: 503 },
      );
    }
    return NextResponse.json(
      { error: "Could not delete RSVP. Try again." },
      { status: 500 },
    );
  }
}
