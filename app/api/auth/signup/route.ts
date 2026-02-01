import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { signupSchema } from "@/lib/validators";
import { signJWT } from "@/lib/jwt";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, email, password } = signupSchema.parse(body);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "Email already in use" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = await signJWT({ userId: user._id.toString() });

    const res = NextResponse.json({
      user: { id: user._id, name: user.name, email: user.email },
    });

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch (err: any) {
    return NextResponse.json(
      { message: err?.message || "Signup failed" },
      { status: 400 }
    );
  }
}