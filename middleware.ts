import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;

  if (request.nextUrl.pathname.startsWith("/employers")) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/sign-in", request.url));
    }
  }
}

export const config = {
  matcher: ["/employers/:path*"],
};
