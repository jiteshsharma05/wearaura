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
        <footer className="bg-[#FAF9F6] text-[#1a1a1a] border-t border-[#e8e6e1] py-16">
            <div className="container mx-auto px-[24px] max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-12 md:gap-8">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <Link href="/" className="text-2xl font-serif font-medium tracking-wide">
                            WearAura
                        </Link>
                        <p className="mt-4 text-sm font-sans text-[#4a4a4a] leading-relaxed max-w-md">
                            Crafting an essence that lingers, creating memories that last.
                        </p>
                    </div>

                    {/* Navigation Links */}
                    <div>
                        <h3 className="text-xs font-semibold uppercase tracking-widest text-[#1a1a1a] mb-4">Navigate</h3>
                        <ul className="space-y-3 font-sans text-sm">
                            <li>
                                <Link href="/#collection" className="text-[#4a4a4a] hover:text-[#1a1a1a] transition-colors">
                                    Shop
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-[#4a4a4a] hover:text-[#1a1a1a] transition-colors">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-[#4a4a4a] hover:text-[#1a1a1a] transition-colors">
                                    Contact
                                </Link>
                            </li>
                            {mounted && user && (
                                <li>
                                    <Link href="/account" className="text-[#4a4a4a] hover:text-[#1a1a1a] transition-colors">
                                        Account
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* Policies */}
                    <div>
                        <h3 className="text-xs font-semibold uppercase tracking-widest text-[#1a1a1a] mb-4">Policies</h3>
                        <ul className="space-y-3 font-sans text-sm">
                            <li>
                                <Link href="/policies/privacy-policy" className="text-[#4a4a4a] hover:text-[#1a1a1a] transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/policies/terms-and-conditions" className="text-[#4a4a4a] hover:text-[#1a1a1a] transition-colors">
                                    Terms &amp; Conditions
                                </Link>
                            </li>
                            <li>
                                <Link href="/policies/shipping-policy" className="text-[#4a4a4a] hover:text-[#1a1a1a] transition-colors">
                                    Shipping Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/policies/return-refund-exchange" className="text-[#4a4a4a] hover:text-[#1a1a1a] transition-colors">
                                    Returns &amp; Refunds
                                </Link>
                            </li>
                            <li>
                                <Link href="/policies/cancellation-policy" className="text-[#4a4a4a] hover:text-[#1a1a1a] transition-colors">
                                    Cancellation Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/policies/product-disclaimer" className="text-[#4a4a4a] hover:text-[#1a1a1a] transition-colors">
                                    Product Disclaimer
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-xs font-semibold uppercase tracking-widest text-[#1a1a1a] mb-4">Contact</h3>
                        <ul className="space-y-3 font-sans text-sm">
                            <li className="text-[#4a4a4a]"><a href="mailto:wearaurafragrance@gmail.com" className="hover:text-[#1a1a1a] transition-colors">wearaurafragrance@gmail.com</a></li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-16 pt-8 border-t border-[#e8e6e1] flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-sans text-[#4a4a4a]">
                    <p>&copy; {new Date().getFullYear()} WearAura. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
