import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { loginSchema } from "@/lib/validators";
import { signJWT } from "@/lib/jwt";

export async function POST(req: Request) {
  try {

    await connectDB();

    const body = await req.json();

    const { email, password } = loginSchema.parse(body);

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const token = await signJWT({ userId: user._id.toString() });

    const res = NextResponse.json({
      user: { id: user._id, name: user.name, email: user.email },
    });

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (err: any) {
    return NextResponse.json(
      { message: err?.message || "Login failed" },
      { status: 400 }
    );
  }
}