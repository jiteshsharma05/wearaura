"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Sparkles, User } from "lucide-react";
import { useAuth } from "./AuthProvider";

export default function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const isHome = pathname === "/";
  const isExplore = pathname.startsWith("/products") || pathname === "/collection";
  const isPhilosophy = pathname === "/about";
  const isProfile = pathname.startsWith("/account") || pathname === "/login" || pathname === "/signup" || pathname === "/my-orders";

  return (
    <nav className="md:hidden bg-[#F7F4EE]/90 backdrop-blur-2xl border-t border-[#817B73]/15 shadow-2xl fixed bottom-0 left-0 w-full z-40 flex justify-around items-center h-20 px-6 pb-2">
      {/* Home */}
      <Link
        href="/"
        className={`flex flex-col items-center justify-center relative p-2 transition-all duration-300 ${
          isHome
            ? "text-[#5B3C58] scale-105 after:content-[''] after:absolute after:bottom-0 after:w-1 after:h-1 after:bg-[#5B3C58] after:rounded-full"
            : "text-[#817B73]/60 hover:text-[#5B3C58]"
        }`}
        aria-label="Home"
      >
        <Home className={`w-5 h-5 ${isHome ? "stroke-[2px]" : "stroke-[1.5px]"}`} />
        <span className="text-[10px] font-medium tracking-wider uppercase mt-1">Home</span>
      </Link>

      {/* Explore / Collection */}
      <Link
        href="/#collection"
        className={`flex flex-col items-center justify-center relative p-2 transition-all duration-300 ${
          isExplore
            ? "text-[#5B3C58] scale-105 after:content-[''] after:absolute after:bottom-0 after:w-1 after:h-1 after:bg-[#5B3C58] after:rounded-full"
            : "text-[#817B73]/60 hover:text-[#5B3C58]"
        }`}
        aria-label="Explore Collection"
      >
        <Compass className={`w-5 h-5 ${isExplore ? "stroke-[2px]" : "stroke-[1.5px]"}`} />
        <span className="text-[10px] font-medium tracking-wider uppercase mt-1">Explore</span>
      </Link>

      {/* Philosophy / Aura */}
      <Link
        href="/about"
        className={`flex flex-col items-center justify-center relative p-2 transition-all duration-300 ${
          isPhilosophy
            ? "text-[#5B3C58] scale-105 after:content-[''] after:absolute after:bottom-0 after:w-1 after:h-1 after:bg-[#5B3C58] after:rounded-full"
            : "text-[#817B73]/60 hover:text-[#5B3C58]"
        }`}
        aria-label="Our Philosophy"
      >
        <Sparkles className={`w-5 h-5 ${isPhilosophy ? "stroke-[2px]" : "stroke-[1.5px]"}`} />
        <span className="text-[10px] font-medium tracking-wider uppercase mt-1">Aura</span>
      </Link>

      {/* Account / Profile */}
      <Link
        href={user ? "/account" : "/login"}
        className={`flex flex-col items-center justify-center relative p-2 transition-all duration-300 ${
          isProfile
            ? "text-[#5B3C58] scale-105 after:content-[''] after:absolute after:bottom-0 after:w-1 after:h-1 after:bg-[#5B3C58] after:rounded-full"
            : "text-[#817B73]/60 hover:text-[#5B3C58]"
        }`}
        aria-label="Profile"
      >
        <User className={`w-5 h-5 ${isProfile ? "stroke-[2px]" : "stroke-[1.5px]"}`} />
        <span className="text-[10px] font-medium tracking-wider uppercase mt-1">Profile</span>
      </Link>
    </nav>
  );
}
