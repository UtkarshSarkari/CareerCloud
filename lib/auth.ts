import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/jwt";

export async function getUserIdFromRequest(): Promise<string> {
  const token = (await cookies()).get("token")?.value || "";

  if (!token) {
    throw new Error("Unauthorized");
  }

  const payload = await verifyJWT<{ userId: string }>(token);
  return payload.userId;
}