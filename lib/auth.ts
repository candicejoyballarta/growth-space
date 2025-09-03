/* eslint-disable @typescript-eslint/no-explicit-any */
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDB } from "@/lib/mongoose";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import NextAuth, { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        await connectToDB();

        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("No user found with this email");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image ?? null,
          bio: user.bio ?? "",
          role: user.role ?? "",
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // On initial sign-in
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role ?? "";
        token.bio = user.bio ?? "";
        token.image = user.image ?? null;
      }

      // On client-side session.update()
      if (trigger === "update" && session?.user) {
        const userData = session.user;
        token.name = userData.name ?? token.name;
        token.email = userData.email ?? token.email;
        token.role = userData.role ?? token.role;
        token.bio = userData.bio ?? token.bio;
        token.image = userData.image ?? token.image;

        // Persist email change to DB
        if (token.id && token.email) {
          try {
            await User.findByIdAndUpdate(token.id, {
              email: token.email,
              emailVerified: false,
            });
          } catch (err) {
            console.error("Failed to update user email in DB:", err);
          }
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (!session.user) session.user = {} as any;

      session.user.id = token.id as string;
      session.user.name = (token.name as string) ?? "";
      session.user.email = (token.email as string) ?? "";
      session.user.role = (token.role as string) ?? "";
      session.user.bio = (token.bio as string) ?? "";

      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
};

export default NextAuth(authOptions);
