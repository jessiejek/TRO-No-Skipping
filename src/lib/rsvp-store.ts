import { put, list } from "@vercel/blob";
import { promises as fs } from "fs";
import path from "path";
import type { CreateRsvpInput, Rsvp } from "./types";

const LOCAL_PATH = path.join(process.cwd(), "data", "rsvps.json");
const BLOB_PATHNAME = "tro-no-skipping/rsvps.json";

function useBlob(): boolean {
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

async function readBlob(): Promise<Rsvp[]> {
  const { blobs } = await list({ prefix: BLOB_PATHNAME });
  const match = blobs.find((b) => b.pathname === BLOB_PATHNAME);
  if (!match) return [];

  const res = await fetch(match.url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to fetch RSVP blob: ${res.status}`);
  }
  const parsed = (await res.json()) as unknown;
  return Array.isArray(parsed) ? (parsed as Rsvp[]) : [];
}

async function writeBlob(rsvps: Rsvp[]): Promise<void> {
  await put(BLOB_PATHNAME, JSON.stringify(rsvps, null, 2), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

export async function getAllRsvps(): Promise<Rsvp[]> {
  if (useBlob()) return readBlob();
  return readLocal();
}

export async function addRsvp(input: CreateRsvpInput): Promise<Rsvp> {
  const name = input.name.trim();
  if (!name) throw new Error("Name is required");
  if (!["yes", "no", "maybe"].includes(input.status)) {
    throw new Error("Invalid status");
  }

  const note = input.note?.trim() || undefined;
  const entry: Rsvp = {
    id: crypto.randomUUID(),
    name,
    status: input.status,
    ...(note ? { note } : {}),
    createdAt: new Date().toISOString(),
  };

  const existing = await getAllRsvps();
  const next = [entry, ...existing];

  if (useBlob()) {
    await writeBlob(next);
  } else if (process.env.VERCEL) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN is missing. Local JSON cannot persist on Vercel.",
    );
  } else {
    await writeLocal(next);
  }

  return entry;
}

export function storageMode(): "blob" | "local" {
  return useBlob() ? "blob" : "local";
}
