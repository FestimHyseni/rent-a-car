// auth.ts (or pages/api/auth/[...nextauth].ts)
import NextAuth, { NextAuthOptions, User as NextAuthUserType } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../lib/mongodb";
import User from "../../../models/User"; // Your Mongoose User model
import Role from "../../../models/Role"; // Import your Mongoose Role model
import dbConnect from "../../../lib/dbConnect";
import bcrypt from "bcryptjs";
import mongoose from "mongoose"; // Import mongoose to use mongoose.Schema.Types.ObjectId

// Extend NextAuth types to include custom properties
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string; // This will be the role name string in the session
      number?: string;
      country?: string;
      city?: string;
      address?: string;
      createdAt?: string;
    };
    accessToken?: string;
  }

  interface JWT {
    id: string;
    role?: string; // This will be the role name string in the JWT
    image?: string;
    number?: string;
    country?: string;
    city?: string;
    address?: string;
    createdAt?: string;
    accessToken?: string;
  }
}

export const authOptions: NextAuthOptions = {
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
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter an email and password.");
        }

        await dbConnect();

        // Fetch user and populate the 'role' field to get the role document
        // Explicitly type the result of populate for better type inference
        const user = await User.findOne({ email: credentials.email })
          .select("+password")
          .populate<{
            role: { _id: mongoose.Schema.Types.ObjectId; name: string };
          }>("role")
          .lean();

        if (!user) {
          throw new Error("No user found with this email.");
        }

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

        // Return the user object, ensuring role is the role name string
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role:
            typeof user.role === "object" &&
            user.role !== null &&
            "name" in user.role
              ? user.role.name
              : "",
          image: user.image || "",
          number: user.number || "",
          country: user.country || "",
          city: user.city || "",
          address: user.address || "",
        };
      },
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({
      token,
      user,
      account,
    }: {
      token: any;
      user?: any;
      account?: any;
    }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image || "";
        token.number = user.number || "";
        token.country = user.country || "";
        token.city = user.city || "";
        token.address = user.address || "";
        token.createdAt = user.createdAt || "";

        if (account) {
          token.accessToken = account.access_token;
        }

        await dbConnect();

        let userRoleName: string | undefined;

        // Type guard for populated role object
        if (
          user.role &&
          typeof user.role === "object" &&
          "name" in user.role &&
          user.role.name
        ) {
          userRoleName = user.role.name;
        } else if (
          typeof user.role === "string" &&
          mongoose.Types.ObjectId.isValid(user.role)
        ) {
          try {
            const roleDoc = await Role.findById(user.role).lean();
            if (roleDoc) {
              userRoleName = roleDoc.name;
            }
          } catch (e) {
            console.error(
              "Error fetching role name by ID (valid ObjectId string assumed):",
              e
            );
          }
        } else {
          // Fallback for OAuth or if role wasn't explicitly handled in authorize.
          // Fetch the user from the DB and populate the role.
          const dbUser = await User.findById(user.id)
            .populate<{
              role: { _id: mongoose.Schema.Types.ObjectId; name: string };
            }>("role")
            .lean();
          if (
            dbUser &&
            dbUser.role &&
            typeof dbUser.role === "object" &&
            "name" in dbUser.role &&
            dbUser.role.name
          ) {
            userRoleName = dbUser.role.name;
          }
        }
        token.role = userRoleName;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string; // Role is already the name string
        session.user.image = token.image as string;
        session.user.number = token.number as string;
        session.user.country = token.country as string;
        session.user.city = token.city as string;
        session.user.address = token.address as string;
        session.user.createdAt = token.createdAt as string;
      }

      if (token.accessToken) {
        session.accessToken = token.accessToken as string;
      }

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

export default NextAuth(authOptions);
