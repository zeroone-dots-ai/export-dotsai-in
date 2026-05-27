// Clerk middleware — gates /dashboard routes.
// Marketing routes (/, /pricing, /about, /how-it-works, etc.) remain public.
//
// Once Clerk env vars are set, uncomment the import + implementation.

// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";

// const isProtected = createRouteMatcher(["/dashboard(.*)", "/api/(.*)"]);
// export default clerkMiddleware((auth, req) => {
//   if (isProtected(req)) auth().protect();
// });

// Placeholder until Clerk is wired (so `npm run build` doesn't break):
export default function middleware(_req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)"],
};
