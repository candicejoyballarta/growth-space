import { ReactNode } from "react";
import Sidebar from "@/components/shared/Sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="md:ml-[250px] p-6">{children}</main>
    </div>
  );
}
