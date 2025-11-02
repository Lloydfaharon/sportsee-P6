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
    <header className="flex items-center justify-between py-10">
      <Logo />

      <nav className="flex  bg-white justify-center h-15 rounded-[40px] p-2.5  w-[561px]">
        <div className="flex gap-8 justify-center h-10 p-2.5 w-[561px]">
          <button
            onClick={() => router.push("/dashboard")}
            className={`transition-colors ${
              pathname === "/dashboard"
                ? "text-blue-700 "
                : "text-black hover:text-blue-700"
            }`}
          >
            Dashboard
          </button>

          <button
            onClick={() => router.push("/coach")}
            className={`transition-colors ${
              pathname === "/coach"
                ? "text-blue-700 "
                : "text-black hover:text-blue-700"
            }`}
          >
            Coach AI
          </button>

          <button
            onClick={() => router.push("/profile")}
            className={`transition-colors ${
              pathname === "/profile"
                ? "text-blue-700 "
                : "text-black hover:text-blue-700"
            }`}
          >
            Mon profil
          </button>

          <button
            onClick={handleLogout}
            className="text-blue-700 pl-7 border-l-[1px] border-blue-700"
          >
            Se déconnecter
          </button>
        </div>
      </nav>
    </header>
  );
}
