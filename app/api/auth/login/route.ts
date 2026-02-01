import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { loginSchema } from "@/lib/validators";
import { signJWT } from "@/lib/jwt";

export async function POST(req: Request) {
  try {
    console.log("🔐 Login route called");
    
    await connectDB();
    console.log("✅ Database connected");
    
    const body = await req.json();
    console.log("📧 Login attempt for email:", body.email);
    
    const { email, password } = loginSchema.parse(body);

    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found:", email);
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    console.log("👤 User found:", user.email);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Password mismatch");
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    console.log("✅ Password matched");

    const token = await signJWT({ userId: user._id.toString() });
    console.log("🎫 Token generated");

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

    console.log("🍪 Cookie set, login successful");
    return res;
  } catch (err: any) {
    console.error("❌ Login error:", err);
    return NextResponse.json(
      { message: err?.message || "Login failed" },
      { status: 400 }
    );
  }
}