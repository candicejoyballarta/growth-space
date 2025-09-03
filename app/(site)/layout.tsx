import type { ReactNode } from "react";
import Navigation from "@/components/shared/Navigation";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navigation />
      <main>{children}</main>
    </>
  );
}
