import { ReactNode } from "react";
import Sidebar from "@/components/shared/Sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[250px_1fr] bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="p-6">{children}</main>
    </div>
  );
}
