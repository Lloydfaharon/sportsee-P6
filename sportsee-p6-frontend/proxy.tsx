import { NextResponse } from "next/server";

export default async function proxy(req: Request) {
  const url = new URL(req.url);
  const pathname = url.pathname;

  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }


  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/images") ||
    pathname.endsWith(".css") ||
    pathname.endsWith(".js") ||
    pathname.endsWith(".svg") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".jpg") ||
    pathname.endsWith(".jpeg")
  ) {
    return NextResponse.next();
  }


  const token = req.headers.get("cookie")?.match(/sportsee_token=([^;]+)/)?.[1];

  const publicPaths = ["/"]; // 


  if (!publicPaths.includes(pathname) && !token) {
    return NextResponse.redirect(new URL("/", req.url));
  }


  if (pathname === "/" && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}
