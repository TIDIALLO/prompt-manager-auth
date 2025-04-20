// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define routes that should be publicly accessible without authentication
const isPublicRoute = createRouteMatcher([
  "/", // Root/marketing page
  "/pricing", // Pricing page - ADDED
  "/sign-in(.*)", // Sign-in pages
  "/api/stripe/webhooks" // Stripe webhook handler - ADDED
]);

// Export the middleware function
export default clerkMiddleware(async (auth, req) => {
  // Check if the requested route is NOT public
  if (!isPublicRoute(req)) {
    // If it's not public, enforce authentication
    await auth.protect();
  }
});

// Configuration object for the middleware
export const config = {
  matcher: [
    // ... (existing matcher config) ...
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)"
  ]
};