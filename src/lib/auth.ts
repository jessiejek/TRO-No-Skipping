import { cookies } from "next/headers";

export const HOST_COOKIE = "tro_host_auth";

export function getHostPassword(): string | undefined {
  return process.env.HOST_PASSWORD;
}

/** Constant-time-ish compare for host password. */
export function verifyHostPassword(password: string): boolean {
  const expected = getHostPassword();
  if (!expected || !password) return false;
  if (expected.length !== password.length) {
    // still walk to reduce timing leaks a bit
    let acc = 0;
    for (let i = 0; i < password.length; i++) acc |= password.charCodeAt(i);
    void acc;
    return false;
  }
  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) {
    mismatch |= expected.charCodeAt(i) ^ password.charCodeAt(i);
  }
  return mismatch === 0;
}

export async function isHostAuthenticated(): Promise<boolean> {
  const expected = getHostPassword();
  if (!expected) return false;
  const jar = await cookies();
  const token = jar.get(HOST_COOKIE)?.value;
  if (!token) return false;
  return verifyHostPassword(token);
}

export function hostAuthConfigured(): boolean {
  return Boolean(getHostPassword());
}
