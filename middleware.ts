import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "@/lib/jwt";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const pathname = req.nextUrl.pathname;

  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/signup");
  const isDashboard = pathname.startsWith("/dashboard");

  if (!token) {
    
    if (isAuthPage) {
      return NextResponse.next();
    }
    
    if (isDashboard) {

      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  
  try {
    await verifyJWT(token);


    
    if (isAuthPage) {

      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    

    return NextResponse.next();
  } catch (error) {

    
    const response = isDashboard
      ? NextResponse.redirect(new URL("/login", req.url))
      : NextResponse.next();

    
    response.cookies.set("token", "", {
      httpOnly: true,
      path: "/",
      expires: new Date(0),
    });


    return response;
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};