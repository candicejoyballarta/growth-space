import type { ReactNode } from "react";
import Navigation from "@/components/shared/Navigation";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navigation />
      <main className="min-h-[calc(100vh-4rem)]">{children}</main>
    </>
  );
}
