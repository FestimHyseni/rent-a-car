// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt"; // Import getToken

// Configure your JWT secret for middleware.
// This should be the same as your NEXTAUTH_SECRET environment variable.
const JWT_SECRET = process.env.NEXTAUTH_SECRET;

export async function middleware(request: NextRequest) {
  // Get the token from the request. This will contain the session data.
  const token = await getToken({ req: request, secret: JWT_SECRET });

  const { pathname } = request.nextUrl;

  // Define paths that require authentication
  const protectedPaths = ["/dashboard"];
  // Define paths that require admin role

  // 1. Handle unauthenticated users for protected paths
  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    if (!token) {
      const url = new URL(`/login`, request.url);
      url.searchParams.set("callbackUrl", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }

  // 2. Handle unauthorized non-admin users for admin paths
  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    if (!token) {
      // If no token, user is not authenticated, redirect to login
      const url = new URL(`/login`, request.url);
      url.searchParams.set("callbackUrl", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    // Check if the user's role is 'admin' from the token
    const userRole = token.role;
    console.log(userRole);

    if (userRole !== "admin" && userRole !== "staff") {
      // Redirect to an unauthorized page or dashboard
      const url = new URL("/", request.url);
      // Optional: Add a message if you want to display why they were redirected
      url.searchParams.set("message", "Access Denied: Admin role required.");
      return NextResponse.redirect(url);
    }
  }

  // Continue to the requested page if no redirection is needed
  const response = NextResponse.next();
  response.headers.set("x-custom-header", "Hello from middleware!");
  return response;
}

// Specify which paths the middleware should run on.
// This is important for performance.
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|login|unauthorized).*)",
    "/dashboard/:path*",
  ],
};
