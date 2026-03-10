import { SignJWT, jwtVerify } from "jose";
import { getAuthConfig } from "./config";

function getSecret() {
  const { jwtSecret } = getAuthConfig();
  return new TextEncoder().encode(jwtSecret);
}

export async function createVerifyToken(
  email: string,
  code: string
): Promise<string> {
  return new SignJWT({
    email: email.trim().toLowerCase(),
    code,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("10m")
    .sign(getSecret());
}

export async function validateVerifyToken(
  token: string,
  email: string,
  code: string
): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return (
      payload.email === email.trim().toLowerCase() && payload.code === code
    );
  } catch {
    return false;
  }
}
