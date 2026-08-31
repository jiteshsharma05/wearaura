"use client";

import Link from "next/link";
import { useAuth } from "./AuthProvider";
import { useEffect, useState } from "react";

export default function Footer() {
    const { user } = useAuth();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <footer className="bg-[#0e0e10] border-t border-[#9a8f80]/10 py-16 px-6 text-center flex flex-col items-center gap-6 full-width mb-20 md:mb-0 relative z-20">
            {/* Brand */}
            <div>
                <Link href="/" className="inline-block group">
                    <h2 className="text-[14px] font-semibold uppercase tracking-[0.25em] text-[#e8c17b] transition-colors">
                        WearAura
                    </h2>
                    <p className="text-[9px] font-medium text-[#d1c5b4]/60 mt-1 tracking-[0.3em] uppercase">
                        Haute Parfumerie
                    </p>
                </Link>
            </div>

            {/* Navigation Links */}
            <div className="flex flex-wrap justify-center gap-6 sm:gap-8 my-2 max-w-2xl">
                <Link 
                    href="/#collection" 
                    className="text-[#d1c5b4]/60 hover:text-[#e8c17b] transition-colors text-[11px] uppercase tracking-wider"
                >
                    The Collection
                </Link>
                <Link 
                    href="/about" 
                    className="text-[#d1c5b4]/60 hover:text-[#e8c17b] transition-colors text-[11px] uppercase tracking-wider"
                >
                    The Philosophy
                </Link>
                <Link 
                    href="/contact" 
                    className="text-[#d1c5b4]/60 hover:text-[#e8c17b] transition-colors text-[11px] uppercase tracking-wider"
                >
                    Concierge
                </Link>
                <Link 
                    href="/policies/shipping-policy" 
                    className="text-[#d1c5b4]/60 hover:text-[#e8c17b] transition-colors text-[11px] uppercase tracking-wider"
                >
                    Shipping &amp; Returns
                </Link>
                <Link 
                    href="/policies/privacy-policy" 
                    className="text-[#d1c5b4]/60 hover:text-[#e8c17b] transition-colors text-[11px] uppercase tracking-wider"
                >
                    Privacy Policy
                </Link>
                <Link 
                    href="/policies/terms-and-conditions" 
                    className="text-[#d1c5b4]/60 hover:text-[#e8c17b] transition-colors text-[11px] uppercase tracking-wider"
                >
                    Terms of Service
                </Link>
                {mounted && user && (
                    <Link 
                        href="/account" 
                        className="text-[#d1c5b4]/60 hover:text-[#e8c17b] transition-colors text-[11px] uppercase tracking-wider"
                    >
                        My Account
                    </Link>
                )}
            </div>

            {/* Subtle Divider */}
            <div className="aura-divider w-full max-w-md my-2 opacity-40"></div>

            {/* Copyright & Sub-label */}
            <div className="space-y-1">
                <p className="text-[#d1c5b4]/40 text-xs font-light">
                    &copy; {new Date().getFullYear()} WearAura Haute Parfumerie. All rights reserved.
                </p>
                <p className="text-[10px] text-[#d1c5b4]/30 uppercase tracking-[0.25em]">
                    Designed for the Discerning
                </p>
            </div>
        </footer>
    );
}

