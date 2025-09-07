import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image: string;
      bio: string;
      role: string;
      onboarded: boolean;
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    image: string;
    bio: string;
    role: string;
    onboarded: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    onboarded: boolean;
  }
}
