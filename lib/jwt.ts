import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

const secret = new TextEncoder().encode(JWT_SECRET);

export async function signJWT(payload: object, expiresIn = "7d") {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not available for signing");
  }
  
  const token = await new SignJWT(payload as any)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(expiresIn)
    .setIssuedAt()
    .sign(secret);
  
  return token;
}

export async function verifyJWT<T>(token: string): Promise<T> {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not available for verification");
  }
  
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as T;
  } catch (error: any) {
    console.error("JWT verification failed:", error.message);
    throw error;
  }
}