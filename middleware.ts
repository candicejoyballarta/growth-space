import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;

    if (req.nextUrl.pathname.startsWith("/dashboard") && !token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (req.nextUrl.pathname.startsWith("/onboarding")) {
      if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
      if (token?.onboarded) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    if (req.nextUrl.pathname.startsWith("/admin")) {
      if (!token || token.role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
      newUser: "/onboarding",
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/onboarding/:path*"],
};
