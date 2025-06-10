import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../lib/mongodb";
import User from "../../../models/User";
import dbConnect from "../../../lib/dbConnect";
import bcrypt from "bcryptjs";

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

        const user = await User.findOne({ email: credentials.email }).select(
          "+password"
        );

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

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role || "",
          image: user.image || "",
          number: user.number || "",
          country: user.country || "",
          city: user.city || "",
          address: user.address || "",
          createdAt: user.createdAt?.toISOString() || "",
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
    async jwt({ token, user, account }) {
      if (account && user) {
        token.accessToken = account.access_token;
        token.id = user.id;
        token.role = user.role || "";
        token.image = user.image || "";
        token.number = user.number || "";
        token.country = user.country || "";
        token.city = user.city || "";
        token.address = user.address || "";
        token.createdAt = user.createdAt || "";

        // If OAuth and user fields missing, fetch from DB
        if (!user.number || !user.country || !user.city || !user.address) {
          await dbConnect();
          const dbUser = await User.findById(user.id).lean();
          if (dbUser) {
            token.number = dbUser.number || "";
            token.country = dbUser.country || "";
            token.city = dbUser.city || "";
            token.address = dbUser.address || "";
            token.image = dbUser.image || "";
            token.createdAt = dbUser.createdAt?.toISOString() || "";
          }
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
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
