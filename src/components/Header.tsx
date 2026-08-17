"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";
import { useAuth } from "./AuthProvider";
import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import {
    Menu, X, User, ShoppingBag,
    LayoutDashboard, LogOut, LogIn, UserPlus, Package,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../lib/supabase";

function SidebarMenu({
    isOpen,
    onClose,
    user,
    isAdmin,
    cartCount,
    mounted,
    onSignOut,
}: {
    isOpen: boolean;
    onClose: () => void;
    user: ReturnType<typeof useAuth>["user"];
    isAdmin: boolean;
    cartCount: number;
    mounted: boolean;
    onSignOut: () => void;
}) {
    const [portalRoot, setPortalRoot] = useState<Element | null>(null);

    useEffect(() => {
        setPortalRoot(document.body);
    }, []);

    if (!portalRoot) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        onClick={onClose}
                        style={{ position: "fixed", inset: 0, zIndex: 9998 }}
                        className="bg-black/40 backdrop-blur-sm"
                    />

                    <motion.div
                        key="panel"
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "tween", duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            bottom: 0,
                            width: "min(85vw, 360px)",
                            zIndex: 9999,
                        }}
                        className="bg-[#FAF9F6] shadow-2xl flex flex-col font-sans overflow-y-auto"
                    >
                        <div className="flex justify-between items-center px-6 py-5 border-b border-[#e8e6e1] flex-shrink-0">
                            <span className="text-[20px] font-serif tracking-wide text-[#1a1a1a]">WearAura</span>
                            <button
                                onClick={onClose}
                                aria-label="Close menu"
                                className="p-2 text-[#4a4a4a] hover:text-[#1a1a1a] bg-[#f0eeea] hover:bg-[#e8e6e1] rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <nav className="flex flex-col flex-1 py-4">
                            <Link href="/" onClick={onClose} className="px-6 py-4 text-[16px] font-medium text-[#1a1a1a] hover:bg-[#f0eeea] transition-colors">Home</Link>
                            <Link href="/#collection" onClick={onClose} className="px-6 py-4 text-[16px] font-medium text-[#1a1a1a] hover:bg-[#f0eeea] transition-colors">Shop</Link>
                            <Link href="/about" onClick={onClose} className="px-6 py-4 text-[16px] font-medium text-[#1a1a1a] hover:bg-[#f0eeea] transition-colors">About</Link>
                            <Link href="/contact" onClick={onClose} className="px-6 py-4 text-[16px] font-medium text-[#1a1a1a] hover:bg-[#f0eeea] transition-colors">Contact</Link>
                        </nav>

                        <div className="border-t border-[#e8e6e1] bg-[#f0eeea] px-6 py-5 flex-shrink-0">
                            {mounted && (
                                user ? (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-[#1a1a1a] flex items-center justify-center text-[#FAF9F6] text-sm font-serif flex-shrink-0">
                                                {user.email?.charAt(0).toUpperCase()}
                                            </div>
                                            <p className="text-sm font-medium text-[#1a1a1a] truncate">{user.email}</p>
                                        </div>
                                        <Link href="/account" onClick={onClose} className="flex items-center gap-3 py-2 text-sm text-[#4a4a4a] hover:text-[#1a1a1a] transition-colors">
                                            <User className="w-4 h-4" /> My Account
                                        </Link>
                                        <Link href="/my-orders" onClick={onClose} className="flex items-center gap-3 py-2 text-sm text-[#4a4a4a] hover:text-[#1a1a1a] transition-colors">
                                            <Package className="w-4 h-4" /> My Orders
                                        </Link>
                                        {isAdmin && (
                                            <Link href="/admin" onClick={onClose} className="flex items-center gap-3 py-2 text-sm text-[#4a4a4a] hover:text-[#1a1a1a] transition-colors">
                                                <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
                                            </Link>
                                        )}
                                        <button
                                            onClick={onSignOut}
                                            className="w-full flex items-center justify-center gap-2 py-3 mt-4 bg-[#1a1a1a] text-[#FAF9F6] hover:bg-[#333] text-sm font-medium rounded-md transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Log Out
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <Link
                                            href="/login"
                                            onClick={onClose}
                                            className="w-full flex items-center justify-center gap-2 py-3 bg-[#1a1a1a] text-[#FAF9F6] hover:bg-[#333] text-sm font-medium rounded-md transition-colors"
                                        >
                                            <LogIn className="w-4 h-4" />
                                            Login
                                        </Link>
                                        <Link
                                            href="/signup"
                                            onClick={onClose}
                                            className="w-full flex items-center justify-center gap-2 py-3 bg-transparent border border-[#d4d2cc] text-[#1a1a1a] hover:bg-[#e8e6e1] text-sm font-medium rounded-md transition-colors"
                                        >
                                            <UserPlus className="w-4 h-4" />
                                            Sign Up
                                        </Link>
                                    </div>
                                )
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        portalRoot
    );
}

export default function Header() {
    const { cartCount } = useCart();
    const { user, signOut, loading } = useAuth();
    const [mounted, setMounted] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const userDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
        const handleClickOutside = (event: MouseEvent) => {
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
                setUserDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (user) {
            supabase
                .from("profiles")
                .select("role")
                .eq("id", user.id)
                .single()
                .then(({ data }) => setIsAdmin(data?.role === "admin"));
        } else {
            setIsAdmin(false);
        }
    }, [user]);

    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isMenuOpen]);

    const handleSignOut = async () => {
        setIsMenuOpen(false);
        setUserDropdownOpen(false);
        await signOut();
    };

    return (
        <>
            <header className="fixed top-0 left-0 right-0 h-[72px] bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#e8e6e1] z-50">
                <div className="h-full px-6 flex justify-between items-center max-w-[1400px] mx-auto">
                    
                    {/* Left: Hamburger Menu */}
                    <div className="flex-1 flex justify-start items-center">
                        <button
                            onClick={() => setIsMenuOpen(true)}
                            className="p-2 -ml-2 text-[#4a4a4a] hover:text-[#1a1a1a] transition-colors focus:outline-none"
                            aria-label="Toggle menu"
                        >
                            <Menu className="w-6 h-6 stroke-[1.5px]" />
                        </button>
                    </div>

                    {/* Center: Brand */}
                    <div className="flex-1 flex justify-center items-center">
                        <Link href="/" className="text-[26px] font-serif tracking-normal text-[#1a1a1a] hover:opacity-80 transition-opacity whitespace-nowrap">
                            WearAura
                        </Link>
                    </div>

                    {/* Right: User & Cart */}
                    <div className="flex-1 flex justify-end items-center gap-3 sm:gap-4">
                        {mounted && !loading && (
                            <div className="relative flex items-center" ref={userDropdownRef}>
                                {user ? (
                                    <button
                                        onClick={() => setUserDropdownOpen(v => !v)}
                                        className="p-2 text-[#4a4a4a] hover:text-[#1a1a1a] transition-colors focus:outline-none"
                                        aria-label="Account menu"
                                    >
                                        <User className="w-6 h-6 stroke-[1.5px]" />
                                    </button>
                                ) : (
                                    <Link
                                        href="/login"
                                        className="p-2 text-[#4a4a4a] hover:text-[#1a1a1a] transition-colors focus:outline-none"
                                        aria-label="Login"
                                    >
                                        <User className="w-6 h-6 stroke-[1.5px]" />
                                    </Link>
                                )}

                                <AnimatePresence>
                                    {userDropdownOpen && user && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 8 }}
                                            transition={{ duration: 0.18 }}
                                            className="absolute top-12 right-0 w-48 bg-[#FAF9F6] border border-[#e8e6e1] shadow-xl rounded-md py-2 z-50 flex flex-col font-sans"
                                        >
                                            <div className="px-4 py-3 border-b border-[#e8e6e1] mb-1">
                                                <p className="text-[10px] text-[#8a8a8a] uppercase tracking-widest">Account</p>
                                                <p className="text-sm font-medium text-[#1a1a1a] truncate mt-0.5">{user.email}</p>
                                            </div>
                                            <Link href="/account" onClick={() => setUserDropdownOpen(false)} className="px-4 py-2.5 text-sm text-[#4a4a4a] hover:text-[#1a1a1a] hover:bg-[#f0eeea] transition-colors">My Profile</Link>
                                            <Link href="/my-orders" onClick={() => setUserDropdownOpen(false)} className="px-4 py-2.5 text-sm text-[#4a4a4a] hover:text-[#1a1a1a] hover:bg-[#f0eeea] transition-colors">My Orders</Link>
                                            {isAdmin && (
                                                <Link href="/admin" onClick={() => setUserDropdownOpen(false)} className="px-4 py-2.5 text-sm text-[#4a4a4a] hover:text-[#1a1a1a] hover:bg-[#f0eeea] transition-colors">Admin Dashboard</Link>
                                            )}
                                            <button onClick={handleSignOut} className="px-4 py-2.5 text-sm text-left text-[#1a1a1a] hover:bg-[#f0eeea] transition-colors border-t border-[#e8e6e1] mt-1 pt-3">
                                                Log Out
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}

                        <Link href="/cart" className="p-2 text-[#4a4a4a] hover:text-[#1a1a1a] transition-colors relative focus:outline-none" aria-label="Shopping Cart">
                            <ShoppingBag className="w-6 h-6 stroke-[1.5px]" />
                            <AnimatePresence>
                                {mounted && cartCount > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        className="absolute top-1 right-0 bg-[#1a1a1a] text-[#FAF9F6] text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full ring-2 ring-[#FAF9F6]"
                                    >
                                        {cartCount}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Link>
                    </div>
                </div>
            </header>

            <SidebarMenu
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                user={user}
                isAdmin={isAdmin}
                cartCount={cartCount}
                mounted={mounted}
                onSignOut={handleSignOut}
            />
        </>
    );
}
