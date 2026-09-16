"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import Logo from "@/app/components/logo/logo";
import { removeAuthToken } from "@/app/utils/auth";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname(); // Récupère la route actuelle

  const handleLogout = () => {
    removeAuthToken();
    router.push("/");
  };

  return (
    <header className="flex flex-col md:flex-row items-center justify-between gap-6 py-6 md:py-10">
      <Logo />

      <nav className="flex bg-white justify-center h-auto md:h-15 rounded-[40px] p-2 md:p-2.5 w-full max-w-[561px] shadow-sm">
        <div className="flex flex-wrap gap-4 sm:gap-6 md:gap-8 justify-center items-center p-2 w-full text-sm sm:text-base">
          <button
            onClick={() => router.push("/dashboard")}
            className={`transition-colors ${pathname === "/dashboard"
              ? "text-blue-700 font-semibold"
              : "text-black hover:text-blue-700"
              }`}
          >
            Dashboard
          </button>

          <button
            onClick={() => router.push("/coach")}
            className={`transition-colors ${pathname === "/coach"
              ? "text-blue-700 font-semibold"
              : "text-black hover:text-blue-700"
              }`}
          >
            Coach AI
          </button>

          <button
            onClick={() => router.push("/profile")}
            className={`transition-colors ${pathname === "/profile"
              ? "text-blue-700 font-semibold"
              : "text-black hover:text-blue-700"
              }`}
          >
            Mon profil
          </button>

          <button
            onClick={handleLogout}
            className="text-blue-700 pl-3 sm:pl-6 border-l border-blue-700 font-medium"
          >
            Se déconnecter
          </button>
        </div>
      </nav>
    </header>
  );
}
