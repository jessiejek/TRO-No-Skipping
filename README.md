# TRO: No Skipping

Mobile-first RSVP web app for **Amor**’s pickleball birthday party (brand: TRO: No Skipping).

**Stack:** Next.js (App Router) · TypeScript · Tailwind CSS v4 · optional [Vercel Blob](https://vercel.com/docs/storage/vercel-blob)

## Event

| | |
|---|---|
| Celebrant | Amor |
| Birthday | October 20 |
| Party | Saturday, October 24, 2026 · 4:00 PM – 7:00 PM |
| Venue | Prospin Davao |
| Activity | Pickleball birthday party |

Config lives in [`src/lib/event.ts`](src/lib/event.ts).

## Quick start

```bash
cd TRO-No-Skipping
cp .env.example .env.local
# edit HOST_PASSWORD in .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the invite / RSVP form.  
Host: [http://localhost:3000/host](http://localhost:3000/host) (uses `HOST_PASSWORD`).

```bash
npm run build && npm start   # production locally
```

## Persistence

RSVP shape:

```ts
{ id, name, status: 'yes' | 'no' | 'maybe', note?, createdAt }
```

| Environment | Backend |
|---|---|
| Local / no token | `data/rsvps.json` (starts as `[]`) |
| `BLOB_READ_WRITE_TOKEN` set | Vercel Blob at pathname `tro-no-skipping/rsvps.json` |

APIs:

- `POST /api/rsvp` — public; create an RSVP
- `GET /api/rsvp` — **host only** (httpOnly cookie set via `/api/host/login`)
- `POST /api/host/login` / `POST /api/host/logout` — host session

## Deploy (Vercel)

1. Push the repo and import the project in Vercel.
2. Set env vars: `HOST_PASSWORD`, and optionally `BLOB_READ_WRITE_TOKEN`.
3. For Blob: create a Blob store in the project, link it, then redeploy.
4. Without Blob, the serverless filesystem is **ephemeral** — use Blob (or another store) in production so RSVPs survive.

## UI notes

- Soft green court UI, pickleball birthday invite
- Mobile-first: large tap targets, ≥16px inputs (no iOS zoom), safe-area insets, no horizontal scroll from 320px up

## Scripts

| Command | |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm start` | Serve built app |
| `npm run lint` | ESLint |

## License

Private event invite — use as you like for this party.
