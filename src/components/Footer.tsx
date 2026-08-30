"use client";

import Link from "next/link";
import { useAuth } from "./AuthProvider";
import { useEffect, useState } from "react";

export default function Footer() {
    const { user } = useAuth();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    return (
        <footer className="bg-[#0B0B0D] text-[#F2EFE9] border-t border-[rgba(201,164,97,0.15)] pt-20 pb-12 relative overflow-hidden">
            {/* Subtle atmospheric ambient glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[150px] bg-gradient-to-b from-[rgba(107,66,38,0.15)] to-transparent blur-3xl pointer-events-none"></div>

            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-12 md:gap-8">
                    {/* Brand */}
                    <div className="md:col-span-2 space-y-4">
                        <Link href="/" className="inline-block group">
                            <span className="text-2xl md:text-3xl font-serif font-light tracking-[0.12em] text-[#F2EFE9] group-hover:text-[#C9A461] transition-colors">
                                WearAura
                            </span>
                            <span className="block text-[8px] uppercase tracking-[0.35em] text-[#C9A461] mt-0.5 font-sans">
                                Haute Parfumerie
                            </span>
                        </Link>
                        <p className="text-sm font-sans text-[#8C8880] leading-relaxed max-w-sm font-light">
                            Crafting an olfactory presence of distinction. Rare essences, bespoke extraction, and an aura that lingers long after you leave.
                        </p>
                        <div className="pt-2 flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#C9A461] animate-pulse"></div>
                            <span className="text-[11px] uppercase tracking-[0.2em] text-[#8C8880]">Handcrafted in Small Batches</span>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div>
                        <h3 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C9A461] mb-5">
                            Boutique
                        </h3>
                        <ul className="space-y-3 font-sans text-xs uppercase tracking-wider">
                            <li>
                                <Link href="/#collection" className="text-[#8C8880] hover:text-[#F2EFE9] hover:translate-x-1 transition-all inline-block">
                                    The Collection
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-[#8C8880] hover:text-[#F2EFE9] hover:translate-x-1 transition-all inline-block">
                                    The Philosophy
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-[#8C8880] hover:text-[#F2EFE9] hover:translate-x-1 transition-all inline-block">
                                    Concierge
                                </Link>
                            </li>
                            {mounted && user && (
                                <li>
                                    <Link href="/account" className="text-[#8C8880] hover:text-[#F2EFE9] hover:translate-x-1 transition-all inline-block">
                                        Client Account
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* Policies */}
                    <div>
                        <h3 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C9A461] mb-5">
                            Policies
                        </h3>
                        <ul className="space-y-3 font-sans text-xs uppercase tracking-wider">
                            <li>
                                <Link href="/policies/privacy-policy" className="text-[#8C8880] hover:text-[#F2EFE9] transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/policies/terms-and-conditions" className="text-[#8C8880] hover:text-[#F2EFE9] transition-colors">
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link href="/policies/shipping-policy" className="text-[#8C8880] hover:text-[#F2EFE9] transition-colors">
                                    Shipping &amp; Delivery
                                </Link>
                            </li>
                            <li>
                                <Link href="/policies/return-refund-exchange" className="text-[#8C8880] hover:text-[#F2EFE9] transition-colors">
                                    Returns &amp; Refunds
                                </Link>
                            </li>
                            <li>
                                <Link href="/policies/cancellation-policy" className="text-[#8C8880] hover:text-[#F2EFE9] transition-colors">
                                    Cancellation Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/policies/product-disclaimer" className="text-[#8C8880] hover:text-[#F2EFE9] transition-colors">
                                    Product Disclaimer
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Concierge Contact */}
                    <div>
                        <h3 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C9A461] mb-5">
                            Client Inquiries
                        </h3>
                        <ul className="space-y-3 font-sans text-xs">
                            <li className="text-[#8C8880] leading-relaxed">
                                For bespoke orders, consultation, or assistance:
                            </li>
                            <li className="pt-1">
                                <a 
                                    href="mailto:wearaurafragrance@gmail.com" 
                                    className="text-[#F2EFE9] hover:text-[#C9A461] transition-colors font-medium border-b border-[rgba(201,164,97,0.3)] pb-0.5 inline-block"
                                >
                                    wearaurafragrance@gmail.com
                                </a>
                            </li>
                            <li className="pt-2 text-[11px] text-[#8C8880] italic">
                                Mon &ndash; Sat &middot; 10:00 AM &ndash; 7:00 PM IST
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Signature Droplet Divider */}
                <div className="aura-divider my-12 opacity-60"></div>

                {/* Copyright & Sub-footer */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-sans text-[#8C8880]">
                    <p>&copy; {new Date().getFullYear()} WearAura Haute Parfumerie. All rights reserved.</p>
                    <p className="tracking-[0.2em] uppercase text-[10px] text-[#8C8880]/70">
                        Designed for the Discerning
                    </p>
                </div>
            </div>
        </footer>
    );
}
