import { NextRequest, NextResponse } from "next/server";
import {
  HOST_COOKIE,
  hostAuthConfigured,
  verifyHostPassword,
} from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (!hostAuthConfigured()) {
    return NextResponse.json(
      {
        error:
          "HOST_PASSWORD is not set. On Vercel: Project Settings → Environment Variables → add HOST_PASSWORD for Production, then Redeploy. Locally: add it to .env.local.",
      },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const password =
    body && typeof body === "object" && "password" in body
      ? String((body as { password: unknown }).password ?? "")
      : "";

  if (!verifyHostPassword(password)) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(HOST_COOKIE, password, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  return res;
}
