import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  if (path.startsWith("/beta/")) {
    const seg = path.split("/")[2];
    const allowed = ["focuspilot", "shiftrix", "linguai"];
    if (!allowed.includes(seg)) {
      return NextResponse.redirect(new URL("/updates", req.url));
    }
    const cookie = req.cookies.get(`beta_${seg}`)?.value;
    if (cookie !== "1") {
      return NextResponse.redirect(new URL("/updates", req.url));
    }
  }

  return NextResponse.next();
}

export const config = { matcher: ["/beta/:path*"] };
