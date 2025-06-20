import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/db";
import { JWT } from "next-auth/jwt";
import { Session, User } from "next-auth";

/**
 * NextAuth session type extension
 * Extends the default session interface to include user ID
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
    };
  }
}

/**
 * NextAuth Configuration Options
 * 
 * Configures authentication for the Landlord App with:
 * - Google OAuth provider
 * - Prisma database adapter
 * - JWT session strategy
 * - Custom callbacks for user data management
 */
export const authOptions = {
  // Use Prisma adapter for database integration
  adapter: PrismaAdapter(prisma),
  
  // Configure authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  
  // Custom callbacks for token and session management
  callbacks: {
    /**
     * JWT callback - handles token creation and updates
     * @param token - Current JWT token
     * @param user - User object from provider
     * @returns Updated token with user information
     */
    async jwt({ token, user }: { token: JWT; user: User | null }) {
      if (user && user.email) {
        // Find user in database to get ID
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
        });
        
        if (dbUser) {
          token.id = dbUser.id;
        }
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    
    /**
     * Session callback - handles session creation and updates
     * @param session - Current session object
     * @param token - JWT token with user information
     * @returns Updated session with user data
     */
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
    
    /**
     * Redirect callback - handles authentication redirects
     * @param url - URL to redirect to
     * @param baseUrl - Base URL of the application
     * @returns Safe redirect URL
     */
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      // Allow relative URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allow URLs from the same origin
      else if (new URL(url).origin === baseUrl) return url;
      // Default to base URL for security
      return baseUrl;
    },
  },
  
  // Security configuration
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt" as const,
  },
  debug: true,
};