import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import Sidebar from "@/components/shared/Sidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const session = await getServerSession(authOptions);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <Sidebar initialSession={session} />

      {/* Main Content */}
      <main className="lg:ml-[250px] p-6">{children}</main>

      {/* Toaster */}
      <Toaster
        toastOptions={{
          style: {
            background: "#f3f4f6", // light
            color: "#111827",
          },
          success: {
            style: {
              background: "#d1fae5",
              color: "#065f46",
            },
          },
          error: {
            style: {
              background: "#fee2e2",
              color: "#b91c1c",
            },
          },
        }}
      />
    </div>
  );
}
