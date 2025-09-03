/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { getSession, signIn, signOut, useSession } from "next-auth/react";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

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
  refreshUser: (newUser?: UserData | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status, update } = useSession();
  const [user, setUser] = useState<UserData | null>(session?.user || null);

  useEffect(() => {
    setUser(session?.user || null);
  }, [session]);

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

    const freshSession = await getSession();

    if (res?.ok && freshSession?.user?.id) {
      try {
        await fetch("/api/activity/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: freshSession.user.id }),
        });
      } catch (err) {
        console.error("Failed to log login activity:", err);
      }
    }

    return {};
  };

  const logout = () => signOut();

  const refreshUser = (newUser?: UserData | null) => {
    if (newUser) setUser(newUser);
    else getSession().then((s) => setUser(s?.user || null));
  };

  return (
    <AuthContext.Provider
      value={{
        user: session?.user || null,
        loading: status === "loading",
        login,
        logout,
        refreshUser,
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
