// pages/api/auth/[...nextauth].ts
import NextAuth, { NextAuthOptions, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../lib/mongodb"; // Utility to connect to MongoDB
import User, { IUser } from "../../../models/User"; // Your Mongoose User model
import dbConnect from "../../../lib/dbConnect"; // Mongoose connection utility
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "john.doe@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter an email and password.");
        }

        await dbConnect(); // Ensure database connection

        const user = await User.findOne({ email: credentials.email }).select(
          "+password"
        );

        if (!user) {
          throw new Error("No user found with this email.");
        }

        // bcrypt.compare returns a promise
        if (!user.password) {
          throw new Error("User does not have a password set.");
        }
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Incorrect password.");
        }

        // Return user object without password
        return {
          id: (user as { _id: { toString(): string } })._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role, // Include role in the user object for the session
          image: user.image,
        };
      },
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: "jwt", // Using JWT for session strategy
  },
  pages: {
    signIn: "/login", // Redirect to custom login page
    // error: '/auth/error', // Custom error page
    // newUser: '/signup' // New users will be directed here after OAuth sign up (optional)
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Persist the OAuth access_token and user role to the token right after signin
      if (account && user) {
        token.accessToken = account.access_token;
        // If it's a credentials login, user object from authorize will have role
        // If it's OAuth, we might need to fetch/assign role from DB
        if (user.role) {
          token.role = user.role;
        } else {
          // For OAuth, fetch user from DB to get role if not directly in user object
          await dbConnect();
          const dbUser = await User.findById(user.id);
          if (dbUser) {
            token.role = dbUser.role;
          }
        }
        token.id = user.id; // Persist user ID to token
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token and user role from JWT
      if (token.accessToken) {
        session.accessToken = token.accessToken as string;
      }
      if (token.role) {
        session.user.role = token.role as string;
      }
      if (token.id && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    // If using database sessions (strategy: "database"), this callback populates the session
    // async session({ session, user }) {
    //   session.user.role = user.role; // Add role to session
    //   session.user.id = user.id;
    //   return session;
    // }
  },
  secret: process.env.NEXTAUTH_SECRET, // A secret for signing cookies
  debug: process.env.NODE_ENV === "development",
};

export default NextAuth(authOptions);
