import { put, get, list, del } from "@vercel/blob"; // JJQR - AI (Oct 7, 2026)
import { promises as fs } from "fs";
import path from "path";
import type { CreateRsvpInput, Rsvp } from "./types";

const LOCAL_PATH = path.join(process.cwd(), "data", "rsvps.json");
// JJQR - AI (Oct 7, 2026): legacy single-file store. Read-only except for the
// rare host delete of an entry that only lives here.
const LEGACY_BLOB_PATHNAME = "tro-no-skipping/rsvps.json";
// JJQR - AI (Oct 7, 2026): one private blob per RSVP, so concurrent submissions
// never overwrite each other and no write ever touches other people's entries.
const RSVP_PREFIX = "tro-no-skipping/rsvps/";
const BACKUP_PREFIX = "tro-no-skipping/backups/"; // JJQR - AI (Oct 7, 2026)

// JJQR - AI (Oct 7, 2026): renamed from useBlob (lint: not a React hook)
function blobEnabled(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

async function readLocal(): Promise<Rsvp[]> {
  try {
    const raw = await fs.readFile(LOCAL_PATH, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as Rsvp[]) : [];
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === "ENOENT") {
      await writeLocal([]);
      return [];
    }
    throw err;
  }
}

async function writeLocal(rsvps: Rsvp[]): Promise<void> {
  await fs.mkdir(path.dirname(LOCAL_PATH), { recursive: true });
  await fs.writeFile(LOCAL_PATH, JSON.stringify(rsvps, null, 2) + "\n", "utf8");
}

// JJQR - AI (Oct 7, 2026): read a private blob as text.
// The v2 SDK get() returns null ONLY on HTTP 404 and throws BlobError on any
// other failure. Here null => "not found"; anything else that is not a full
// 200 response is treated as a failure and thrown, never as "empty".
async function readBlobText(
  pathname: string,
): Promise<{ text: string; etag: string } | null> {
  const result = await get(pathname, { access: "private", useCache: false });
  if (result === null) return null;
  if (result.statusCode !== 200 || !result.stream) {
    throw new Error(
      `Unexpected blob read for ${pathname} (status ${result.statusCode})`,
    );
  }
  const text = await new Response(result.stream).text();
  return { text, etag: result.blob.etag };
}

// JJQR - AI (Oct 7, 2026): minimal check (object with a string id) so corrupt
// data fails loudly. Kept lenient on other fields so no older entry is hidden.
function hasId(value: unknown): value is Rsvp {
  return (
    Boolean(value) &&
    typeof value === "object" &&
    typeof (value as { id?: unknown }).id === "string"
  );
}

// JJQR - AI (Oct 7, 2026): legacy rsvps.json. Missing => []. Failed read or
// unparseable content => throw (never treat a failure as an empty list).
// `raw` is the untouched array so a rewrite never drops entries we skip.
async function readLegacyBlob(): Promise<{
  raw: unknown[];
  rsvps: Rsvp[];
  etag: string | null;
}> {
  const res = await readBlobText(LEGACY_BLOB_PATHNAME);
  if (res === null) return { raw: [], rsvps: [], etag: null };
  if (!res.text.trim()) return { raw: [], rsvps: [], etag: res.etag };
  const parsed = JSON.parse(res.text) as unknown;
  if (!Array.isArray(parsed)) {
    throw new Error("Legacy RSVP file is not a JSON array");
  }
  return { raw: parsed, rsvps: parsed.filter(hasId), etag: res.etag };
}

// JJQR - AI (Oct 7, 2026): list every per-RSVP blob, following pagination.
async function listRsvpBlobs(): Promise<{ pathname: string; url: string }[]> {
  const out: { pathname: string; url: string }[] = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix: RSVP_PREFIX, cursor, limit: 1000 });
    for (const b of page.blobs) {
      if (b.pathname.endsWith(".json")) {
        out.push({ pathname: b.pathname, url: b.url });
      }
    }
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return out;
}

// JJQR - AI (Oct 7, 2026): read one per-RSVP blob. A blob that was listed but
// is now 404 was deleted in between, so it is skipped; any other failure throws.
async function readRsvpBlob(pathname: string): Promise<Rsvp | null> {
  const res = await readBlobText(pathname);
  if (res === null) return null;
  const parsed = JSON.parse(res.text) as unknown;
  if (!hasId(parsed)) {
    throw new Error(`RSVP blob ${pathname} has an invalid shape`);
  }
  return parsed;
}

// JJQR - AI (Oct 7, 2026): pathname for a new RSVP blob. Timestamp first so
// the store sorts chronologically; id last so delete can find it by id.
function rsvpPathname(entry: Rsvp): string {
  const ts = entry.createdAt.replace(/[^0-9A-Za-z]/g, "-");
  return `${RSVP_PREFIX}${ts}-${entry.id}.json`;
}

// JJQR - AI (Oct 7, 2026): merge per-RSVP blobs + legacy file, dedupe, newest first.
async function readAllBlob(): Promise<Rsvp[]> {
  const [blobs, legacy] = await Promise.all([listRsvpBlobs(), readLegacyBlob()]);
  const perRsvp = await Promise.all(blobs.map((b) => readRsvpBlob(b.pathname)));

  const byId = new Map<string, Rsvp>();
  for (const r of legacy.rsvps) byId.set(r.id, r);
  for (const r of perRsvp) if (r) byId.set(r.id, r);

  return [...byId.values()].sort((a, b) =>
    String(b.createdAt ?? "").localeCompare(String(a.createdAt ?? "")),
  );
}

export async function getAllRsvps(): Promise<Rsvp[]> {
  if (blobEnabled()) return readAllBlob(); // JJQR - AI (Oct 7, 2026)
  return readLocal();
}

export async function addRsvp(input: CreateRsvpInput): Promise<Rsvp> {
  const name = input.name.trim();
  if (!name) throw new Error("Name is required");
  if (!["yes", "no"].includes(input.status)) {
    throw new Error("Invalid status");
  }

  const note = input.note?.trim() || undefined;
  if (input.status === "no" && !note) {
    throw new Error("Note is required for Can't make it RSVPs");
  }
  const entry: Rsvp = {
    id: crypto.randomUUID(),
    name,
    status: input.status,
    ...(note ? { note } : {}),
    createdAt: new Date().toISOString(),
  };

  if (blobEnabled()) {
    // JJQR - AI (Oct 7, 2026): write only this RSVP's own blob. No read, no
    // rewrite of the shared list, and never overwrite an existing blob.
    await put(rsvpPathname(entry), JSON.stringify(entry, null, 2), {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: false,
      contentType: "application/json",
    });
  } else if (process.env.VERCEL) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN is missing. Local JSON cannot persist on Vercel.",
    );
  } else {
    // Local dev keeps the single JSON file.
    const existing = await readLocal(); // JJQR - AI (Oct 7, 2026)
    await writeLocal([entry, ...existing]);
  }

  return entry;
}

// JJQR - AI (Oct 7, 2026): blob-mode delete.
// 1) per-RSVP blob for this id => del() just that blob.
// 2) id only in the legacy file => snapshot the legacy file to backups/, then
//    rewrite it without the entry, conditional on the ETag we just read.
async function deleteBlobRsvp(id: string): Promise<boolean> {
  const suffix = `-${id}.json`;
  const matches = (await listRsvpBlobs()).filter((b) =>
    b.pathname.endsWith(suffix),
  );
  if (matches.length > 0) {
    await del(matches.map((b) => b.url));
    return true;
  }

  // Rare path: the entry only exists in the legacy file.
  const legacy = await readLegacyBlob(); // throws on failure, never []
  if (legacy.etag === null) return false;
  const next = legacy.raw.filter((r) => !(hasId(r) && r.id === id));
  if (next.length === legacy.raw.length) return false;

  const ts = new Date().toISOString().replace(/[^0-9A-Za-z]/g, "-");
  await put(
    `${BACKUP_PREFIX}rsvps-${ts}.json`,
    JSON.stringify(legacy.raw, null, 2),
    {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: false,
      contentType: "application/json",
    },
  );
  await put(LEGACY_BLOB_PATHNAME, JSON.stringify(next, null, 2), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    ifMatch: legacy.etag, // fails instead of clobbering a concurrent change
    contentType: "application/json",
  });
  return true;
}

export async function deleteRsvp(id: string): Promise<boolean> {
  if (blobEnabled()) return deleteBlobRsvp(id); // JJQR - AI (Oct 7, 2026)

  if (process.env.VERCEL) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN is missing. Local JSON cannot persist on Vercel.",
    );
  }

  const existing = await readLocal(); // JJQR - AI (Oct 7, 2026)
  const next = existing.filter((r) => r.id !== id);
  if (next.length === existing.length) return false;
  await writeLocal(next);
  return true;
}

export function storageMode(): "blob" | "local" {
  return blobEnabled() ? "blob" : "local";
}
