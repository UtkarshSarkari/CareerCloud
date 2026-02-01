import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "@/lib/jwt";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const pathname = req.nextUrl.pathname;

  console.log(`🛣️  Middleware: ${pathname}, Token: ${token ? "exists" : "missing"}`);

  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/signup");
  const isDashboard = pathname.startsWith("/dashboard");

  // If no token exists
  if (!token) {
    console.log("   No token found");
    // Allow access to auth pages
    if (isAuthPage) {
      console.log("   ✅ Allowing access to auth page");
      return NextResponse.next();
    }
    // Redirect dashboard to login
    if (isDashboard) {
      console.log("   ↩️  Redirecting to /login (no token)");
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  // Token exists - verify it
  try {
    await verifyJWT(token);
    console.log("   ✅ Token valid");
    
    // Valid token - redirect auth pages to dashboard
    if (isAuthPage) {
      console.log("   ↩️  Redirecting to /dashboard (already logged in)");
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    
    // Allow access to dashboard
    console.log("   ✅ Allowing access");
    return NextResponse.next();
  } catch (error) {
    console.log("   ❌ Invalid token");
    // Invalid token - clear it and redirect to login only if on dashboard
    const response = isDashboard 
      ? NextResponse.redirect(new URL("/login", req.url))
      : NextResponse.next();
    
    // Clear the invalid token
    response.cookies.set("token", "", {
      httpOnly: true,
      path: "/",
      expires: new Date(0),
    });
    
    console.log(`   ↩️  ${isDashboard ? "Redirecting to /login" : "Allowing access"} (invalid token cleared)`);
    return response;
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};