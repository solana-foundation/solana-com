import { SignJWT, jwtVerify } from "jose";
import { getAuthConfig } from "./config";

function getSecret() {
  const { jwtSecret } = getAuthConfig();
  return new TextEncoder().encode(jwtSecret);
}

export async function signJwt(email: string): Promise<string> {
  return new SignJWT({ sub: email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifyJwt(
  token: string
): Promise<{ sub: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as { sub: string };
  } catch {
    return null;
  }
}
