import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token as any;
    const path = req.nextUrl.pathname;

    if (path.startsWith("/admin") && token?.role !== "ADMIN" && token?.role !== "TRUST") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (path.startsWith("/feeders") && !token) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ req, token }) {
        if (req.nextUrl.pathname.startsWith("/feeders")) {
          return token !== null;
        }
        if (req.nextUrl.pathname.startsWith("/admin")) {
          return token?.role === "ADMIN" || token?.role === "TRUST";
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/feeders/:path*", "/admin/:path*"],
};
