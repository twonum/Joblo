import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Match any route under "/dashboard" or other protected routes
const isProtectedRoute = createRouteMatcher(["/", "/dashboard"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    const authObject = await auth();
    // Protect the route by redirecting to login if not authenticated
    if (!authObject.userId) {
      return authObject.redirectToSignIn();
    }
  }
});

// Config to specify which routes the middleware should apply to
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
