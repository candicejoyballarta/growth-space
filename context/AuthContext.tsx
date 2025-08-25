/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { createContext, ReactNode, useContext } from "react";

type UserData = {
  id: string;
  name: string;
  email: string;
  image?: string;
  bio?: string;
  role?: string;
};

type AuthContextType = {
  user: UserData | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();

  const login = async (email: string, password: string) => {
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      return {
        error:
          "The email or password you entered is incorrect. Please try again.",
      };
    }

    return {};
  };

  const logout = () => signOut();

  return (
    <AuthContext.Provider
      value={{
        user: session?.user || null,
        loading: status === "loading",
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
