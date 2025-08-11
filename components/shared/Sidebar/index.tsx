"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Home,
  User,
  BarChart2,
  Settings,
  LogOut,
  PlusSquare,
  Menu,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { cn } from "@/lib/utils"; // optional helper from shadcn utils (or remove/copy a simple cn)

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

const NAV: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: <Home className="h-5 w-5" /> },
  {
    href: "/dashboard/profile",
    label: "Profile",
    icon: <User className="h-5 w-5" />,
  },
  {
    href: "/dashboard/insights",
    label: "Insights",
    icon: <BarChart2 className="h-5 w-5" />,
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: <Settings className="h-5 w-5" />,
  },
];

export default function Sidebar() {
  const pathname = usePathname() ?? "/";
  const { data: session } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <>
      {/* Mobile toggle */}
      <div className="md:hidden p-2">
        <button
          onClick={() => setOpen((s) => !s)}
          aria-label="Toggle menu"
          className="inline-flex items-center justify-center rounded-md p-2 bg-white shadow hover:bg-green-50"
        >
          <Menu className="h-5 w-5 text-green-700" />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 transform bg-green-600 text-white md:static md:translate-x-0 transition-transform",
          open
            ? "translate-x-0 w-64"
            : "-translate-x-full md:translate-x-0 md:w-64"
        )}
        aria-label="Sidebar"
      >
        <div className="flex h-full flex-col p-4">
          {/* Logo + Title */}
          <div className="flex items-center gap-3 px-2 py-3">
            <Image src="/icon.png" alt="Growth Space" width={36} height={36} />
            <div>
              <div className="text-lg font-bold">Growth Space</div>
              <div className="text-xs text-green-100/80">
                Reflect • Track • Grow
              </div>
            </div>
          </div>

          <nav className="mt-6 flex-1">
            <ul className="space-y-1">
              {NAV.map((item) => {
                const active =
                  pathname === item.href ||
                  pathname?.startsWith(item.href + "/");
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition",
                        active
                          ? "bg-white/10 text-white shadow-inner"
                          : "text-green-50 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <span
                        className={cn(active ? "text-white" : "text-green-100")}
                      >
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* CTA */}
            <div className="mt-6 px-2">
              <Link
                href="/dashboard/new"
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-white/10 px-3 py-2 text-sm font-medium hover:bg-white/20"
              >
                <PlusSquare className="h-4 w-4 text-white/90" />
                New Entry
              </Link>
            </div>
          </nav>

          {/* User Info */}
          <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-4 px-2">
            <div className="h-10 w-10 flex-none rounded-full bg-white/20 flex items-center justify-center text-sm font-medium">
              {session?.user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold">{session?.user?.name}</div>
              <div className="text-xs text-green-100/80">
                {session?.user?.email}
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="rounded-md bg-white/10 p-2 hover:bg-white/20"
              title="Sign out"
            >
              <LogOut className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>
      </aside>

      {/* Clickable backdrop when mobile menu is open */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          aria-hidden
        />
      )}
    </>
  );
}
