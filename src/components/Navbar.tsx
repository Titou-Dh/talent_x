"use client";

import React from "react";
import {
  Terminal,
  Map as MapIcon,
  Users,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { Link, usePathname } from "@/navigation";
import { useSession, signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher";

export const Navbar = () => {
  const { data: session } = useSession();
  const t = useTranslations("Navigation");
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="border-b-2 border-gray-800 bg-black sticky top-0 z-40 px-4 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <Link
          href="/"
          className="text-4xl font-bold tracking-tighter text-white hover:text-gray-300 transition-colors flex items-center gap-3 group retro-glow"
        >
          <Terminal
            className="group-hover:rotate-180 transition-transform duration-500"
            size={32}
          />
          <span>RETRO_TALENT_MAP</span>
          <span className="animate-blink bg-white w-3 h-8 block"></span>
        </Link>

        <div className="flex items-center gap-6 text-xl tracking-wide">
          <Link
            href="/talents"
            className={`flex items-center gap-2 transition-colors ${
              isActive("/talents")
                ? "text-white border-b-2 border-white"
                : "text-gray-500 hover:text-white"
            }`}
          >
            <Users size={18} /> {t("talents")}
          </Link>
          <Link
            href="/map"
            className={`flex items-center gap-2 transition-colors ${
              isActive("/map")
                ? "text-white border-b-2 border-white"
                : "text-gray-500 hover:text-white"
            }`}
          >
            <MapIcon size={18} /> {t("map")}
          </Link>

          {session ? (
            <>
              <Link
                href="/dashboard"
                className={`flex items-center gap-2 transition-colors ${
                  isActive("/dashboard")
                    ? "text-white border-b-2 border-white"
                    : "text-gray-500 hover:text-white"
                }`}
              >
                <LayoutDashboard size={18} /> {t("dashboard")}
              </Link>
              {session.user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="text-white border border-white px-2 text-sm hover:bg-white hover:text-black"
                >
                  {t("admin")}
                </Link>
              )}
              <button
                onClick={() => signOut()}
                className="text-gray-500 hover:text-white"
                title={t("logout")}
              >
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="text-white animate-pulse hover:bg-white hover:text-black px-2 transition-colors"
            >
              [ {t("login")} ]
            </Link>
          )}
          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  );
};
