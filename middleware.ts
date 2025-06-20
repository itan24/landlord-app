import { withAuth } from "next-auth/middleware";

/**
 * NextAuth Middleware Configuration
 * 
 * Protects specific routes that require authentication.
 * Routes under /dashboard and /add-profile require a valid session.
 * All other routes remain publicly accessible.
 * 
 * @param req - Next.js request object
 * @param token - NextAuth session token
 * @returns boolean indicating if the request is authorized
 */
export default withAuth({
  callbacks: {
    /**
     * Authorization callback function
     * 
     * Determines if a user is authorized to access protected routes.
     * Checks for valid authentication token on protected paths.
     * 
     * @param req - Next.js request object containing URL information
     * @param token - NextAuth session token (null if not authenticated)
     * @returns true if authorized, false if unauthorized
     */
    authorized: ({ req, token }) => {
      const path = req.nextUrl.pathname;
      
      // Protect dashboard and add-profile routes
      if (path.startsWith("/dashboard") || path.startsWith("/add-profile")) {
        // Require valid authentication token for protected routes
        return !!token;
      }
      
      // Allow access to all other routes
      return true;
    },
  },
});

/**
 * Middleware Configuration
 * 
 * Specifies which routes should be processed by this middleware.
 * Only routes matching these patterns will trigger the auth check.
 */
export const config = {
  matcher: [
    // Protect dashboard routes
    "/dashboard/:path*",
    // Protect add-profile routes
    "/add-profile/:path*",
  ],
};