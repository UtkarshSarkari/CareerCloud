import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { verifyJWT } from "@/lib/jwt";
import { cookies } from "next/headers";

export async function GET() {
  try {
    await connectDB();
    const token = (await cookies()).get("token")?.value || "";

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const payload = await verifyJWT<{ userId: string }>(token);

    const user = await User.findById(payload.userId).select("-password");
    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}