"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useSession } from "next-auth/react";

type UserData = {
  _id: string;
  name: string;
  email: string;
  image?: string;
  bio?: string;
  role?: string;
};

type AuthContextType = {
  user: UserData | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchUser() {
    if (!session?.user?.email) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `/api/user?email=${encodeURIComponent(session.user.email)}`
      );
      if (!res.ok) throw new Error("Failed to fetch user data");
      const data = await res.json();
      setUser(data.user);
    } catch (err) {
      console.error("Error fetching user:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  // Allow manual refresh (e.g., after profile update)
  const refreshUser = async () => {
    setLoading(true);
    await fetchUser();
  };

  useEffect(() => {
    if (status !== "loading") {
      fetchUser();
    }
  }, [status, session?.user?.email]);

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
