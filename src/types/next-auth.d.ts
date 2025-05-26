// types/next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken?: string; // If you added accessToken to session
    user: {
      id: string; // Add id
      role: string; // Add role
    } & DefaultSession["user"]; // Keep existing user properties
  }

  interface User extends DefaultUser {
    role: string; // Add role to NextAuth User type
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role?: string; // Add role to JWT token
    id?: string; // Add id to JWT token
  }
}
