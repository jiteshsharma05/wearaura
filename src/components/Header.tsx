"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";
import { useAuth } from "./AuthProvider";
import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import {
    Menu, X, User, ShoppingBag,
    LayoutDashboard, LogOut, LogIn, UserPlus, Package
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../lib/supabase";

function SidebarMenu({
    isOpen,
    onClose,
    user,
    isAdmin,
    mounted,
    onSignOut,
}: {
    isOpen: boolean;
    onClose: () => void;
    user: ReturnType<typeof useAuth>["user"];
    isAdmin: boolean;
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
                        transition={{ duration: 0.25 }}
                        onClick={onClose}
                        style={{ position: "fixed", inset: 0, zIndex: 9998 }}
                        className="bg-black/75 backdrop-blur-sm"
                    />

                    <motion.div
                        key="panel"
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "tween", duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            bottom: 0,
                            width: "min(85vw, 360px)",
                            zIndex: 9999,
                        }}
                        className="bg-[#16151A] border-r border-[rgba(201,164,97,0.2)] shadow-2xl flex flex-col font-sans overflow-y-auto text-[#F2EFE9]"
                    >
                        {/* Drawer Header */}
                        <div className="flex justify-between items-center px-6 py-6 border-b border-[rgba(201,164,97,0.15)] flex-shrink-0 bg-[#111014]/60">
                            <div>
                                <span className="text-[22px] font-serif tracking-[0.1em] text-[#F2EFE9] block font-light">WearAura</span>
                                <span className="text-[9px] uppercase tracking-[0.3em] text-[#C9A461] block -mt-1 font-sans">Haute Parfumerie</span>
                            </div>
                            <button
                                onClick={onClose}
                                aria-label="Close menu"
                                className="p-2 text-[#8C8880] hover:text-[#C9A461] bg-[#1F1E25] hover:bg-[#27252F] rounded-full transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Navigation Links */}
                        <nav className="flex flex-col flex-1 py-6 px-3 space-y-1">
                            <Link 
                                href="/" 
                                onClick={onClose} 
                                className="px-5 py-3.5 text-[13px] uppercase tracking-[0.2em] font-medium text-[#F2EFE9] hover:text-[#C9A461] hover:bg-[#1F1E25]/60 rounded-[2px] transition-all flex items-center justify-between group"
                            >
                                <span>Home</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A461] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                            </Link>
                            <Link 
                                href="/#collection" 
                                onClick={onClose} 
                                className="px-5 py-3.5 text-[13px] uppercase tracking-[0.2em] font-medium text-[#F2EFE9] hover:text-[#C9A461] hover:bg-[#1F1E25]/60 rounded-[2px] transition-all flex items-center justify-between group"
                            >
                                <span>The Collection</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A461] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                            </Link>
                            <Link 
                                href="/about" 
                                onClick={onClose} 
                                className="px-5 py-3.5 text-[13px] uppercase tracking-[0.2em] font-medium text-[#F2EFE9] hover:text-[#C9A461] hover:bg-[#1F1E25]/60 rounded-[2px] transition-all flex items-center justify-between group"
                            >
                                <span>The Philosophy</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A461] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                            </Link>
                            <Link 
                                href="/contact" 
                                onClick={onClose} 
                                className="px-5 py-3.5 text-[13px] uppercase tracking-[0.2em] font-medium text-[#F2EFE9] hover:text-[#C9A461] hover:bg-[#1F1E25]/60 rounded-[2px] transition-all flex items-center justify-between group"
                            >
                                <span>Concierge</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A461] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                            </Link>
                            <Link 
                                href="/wishlist" 
                                onClick={onClose} 
                                className="px-5 py-3.5 text-[13px] uppercase tracking-[0.2em] font-medium text-[#F2EFE9] hover:text-[#C9A461] hover:bg-[#1F1E25]/60 rounded-[2px] transition-all flex items-center justify-between group"
                            >
                                <span>Wishlist</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A461] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                            </Link>
                        </nav>

                        {/* Account Details Footer */}
                        <div className="border-t border-[rgba(201,164,97,0.15)] bg-[#111014] px-6 py-6 flex-shrink-0">
                            {mounted && (
                                user ? (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 pb-3 border-b border-[#232128]">
                                            <div className="w-9 h-9 rounded-full bg-[#C9A461] flex items-center justify-center text-[#0B0B0D] text-sm font-serif font-bold flex-shrink-0">
                                                {user.email?.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="text-xs uppercase tracking-wider text-[#C9A461]">Signed In</p>
                                                <p className="text-sm font-medium text-[#F2EFE9] truncate">{user.email}</p>
                                            </div>
                                        </div>
                                        <Link href="/account" onClick={onClose} className="flex items-center gap-3 py-2 text-xs uppercase tracking-widest text-[#8C8880] hover:text-[#C9A461] transition-colors">
                                            <User className="w-4 h-4 text-[#C9A461]" /> My Profile
                                        </Link>
                                        <Link href="/my-orders" onClick={onClose} className="flex items-center gap-3 py-2 text-xs uppercase tracking-widest text-[#8C8880] hover:text-[#C9A461] transition-colors">
                                            <Package className="w-4 h-4 text-[#C9A461]" /> Order History
                                        </Link>
                                        {isAdmin && (
                                            <Link href="/admin" onClick={onClose} className="flex items-center gap-3 py-2 text-xs uppercase tracking-widest text-[#8C8880] hover:text-[#C9A461] transition-colors">
                                                <LayoutDashboard className="w-4 h-4 text-[#C9A461]" /> Boutique Admin
                                            </Link>
                                        )}
                                        <button
                                            onClick={onSignOut}
                                            className="w-full flex items-center justify-center gap-2 py-3 mt-4 bg-[#1F1E25] hover:bg-[#27252F] text-[#F2EFE9] border border-[rgba(201,164,97,0.2)] text-xs uppercase tracking-[0.15em] font-medium rounded-[2px] transition-colors"
                                        >
                                            <LogOut className="w-4 h-4 text-[#C9A461]" />
                                            Sign Out
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <Link
                                            href="/login"
                                            onClick={onClose}
                                            className="w-full flex items-center justify-center gap-2 py-3 bg-[#C9A461] hover:bg-[#DFC082] text-[#0B0B0D] text-xs uppercase tracking-[0.2em] font-semibold rounded-[2px] transition-colors shadow-lg shadow-[#C9A461]/10"
                                        >
                                            <LogIn className="w-4 h-4" />
                                            Sign In
                                        </Link>
                                        <Link
                                            href="/signup"
                                            onClick={onClose}
                                            className="w-full flex items-center justify-center gap-2 py-3 bg-transparent border border-[rgba(201,164,97,0.35)] text-[#F2EFE9] hover:bg-[#1F1E25] text-xs uppercase tracking-[0.2em] font-medium rounded-[2px] transition-colors"
                                        >
                                            <UserPlus className="w-4 h-4 text-[#C9A461]" />
                                            Create Account
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
    const [scrolled, setScrolled] = useState(false);

    const userDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);

        const handleClickOutside = (event: MouseEvent) => {
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
                setUserDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            window.removeEventListener("scroll", handleScroll);
            document.removeEventListener("mousedown", handleClickOutside);
        };
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
            <header className={`fixed top-0 left-0 right-0 h-[72px] z-50 transition-all duration-300 ${
                scrolled 
                    ? "bg-[#0B0B0D]/90 backdrop-blur-md border-b border-[rgba(201,164,97,0.15)] shadow-2xl shadow-black/60" 
                    : "bg-[#0B0B0D]/70 backdrop-blur-sm border-b border-white/[0.04]"
            }`}>
                <div className="h-full px-6 flex justify-between items-center max-w-[1400px] mx-auto">
                    
                    {/* Left: Hamburger Menu */}
                    <div className="flex-1 flex justify-start items-center">
                        <button
                            onClick={() => setIsMenuOpen(true)}
                            className="p-2 -ml-2 text-[#8C8880] hover:text-[#C9A461] transition-colors focus:outline-none group flex items-center gap-2"
                            aria-label="Toggle menu"
                        >
                            <Menu className="w-5 h-5 stroke-[1.5px] transition-transform duration-300 group-hover:scale-105" />
                            <span className="hidden sm:inline-block text-[11px] uppercase tracking-[0.25em] text-[#8C8880] group-hover:text-[#F2EFE9] transition-colors">
                                Menu
                            </span>
                        </button>
                    </div>

                    {/* Center: Brand */}
                    <div className="flex-1 flex flex-col justify-center items-center text-center">
                        <Link href="/" className="group flex flex-col items-center">
                            <span className="text-[24px] md:text-[28px] font-serif tracking-[0.12em] text-[#F2EFE9] group-hover:text-[#C9A461] transition-colors whitespace-nowrap font-light leading-none">
                                WearAura
                            </span>
                            <span className="text-[8px] uppercase tracking-[0.35em] text-[#C9A461] opacity-70 group-hover:opacity-100 transition-opacity mt-1">
                                Haute Parfumerie
                            </span>
                        </Link>
                    </div>

                    {/* Right: User & Cart */}
                    <div className="flex-1 flex justify-end items-center gap-3 sm:gap-4">
                        {mounted && !loading && (
                            <div className="relative flex items-center" ref={userDropdownRef}>
                                {user ? (
                                    <button
                                        onClick={() => setUserDropdownOpen(v => !v)}
                                        className="p-2 text-[#8C8880] hover:text-[#C9A461] transition-colors focus:outline-none"
                                        aria-label="Account menu"
                                    >
                                        <User className="w-5 h-5 stroke-[1.5px]" />
                                    </button>
                                ) : (
                                    <Link
                                        href="/login"
                                        className="p-2 text-[#8C8880] hover:text-[#C9A461] transition-colors focus:outline-none"
                                        aria-label="Login"
                                    >
                                        <User className="w-5 h-5 stroke-[1.5px]" />
                                    </Link>
                                )}

                                <AnimatePresence>
                                    {userDropdownOpen && user && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8, scale: 0.98 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 8, scale: 0.98 }}
                                            transition={{ duration: 0.18 }}
                                            className="absolute top-12 right-0 w-56 bg-[#16151A] border border-[rgba(201,164,97,0.25)] shadow-2xl rounded-[4px] py-2 z-50 flex flex-col font-sans"
                                        >
                                            <div className="px-4 py-3 border-b border-[#232128] mb-1">
                                                <p className="text-[9px] text-[#C9A461] uppercase tracking-[0.25em]">Account</p>
                                                <p className="text-xs font-medium text-[#F2EFE9] truncate mt-0.5">{user.email}</p>
                                            </div>
                                            <Link href="/account" onClick={() => setUserDropdownOpen(false)} className="px-4 py-2 text-xs uppercase tracking-wider text-[#8C8880] hover:text-[#C9A461] hover:bg-[#1F1E25] transition-colors">
                                                My Profile
                                            </Link>
                                            <Link href="/my-orders" onClick={() => setUserDropdownOpen(false)} className="px-4 py-2 text-xs uppercase tracking-wider text-[#8C8880] hover:text-[#C9A461] hover:bg-[#1F1E25] transition-colors">
                                                My Orders
                                            </Link>
                                            <Link href="/wishlist" onClick={() => setUserDropdownOpen(false)} className="px-4 py-2 text-xs uppercase tracking-wider text-[#8C8880] hover:text-[#C9A461] hover:bg-[#1F1E25] transition-colors">
                                                Saved Fragrances
                                            </Link>
                                            {isAdmin && (
                                                <Link href="/admin" onClick={() => setUserDropdownOpen(false)} className="px-4 py-2 text-xs uppercase tracking-wider text-[#8C8880] hover:text-[#C9A461] hover:bg-[#1F1E25] transition-colors">
                                                    Admin Dashboard
                                                </Link>
                                            )}
                                            <button onClick={handleSignOut} className="px-4 py-2 text-xs text-left uppercase tracking-wider text-[#C9A461] hover:bg-[#1F1E25] transition-colors border-t border-[#232128] mt-1 pt-2.5">
                                                Log Out
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}

                        <Link href="/cart" className="p-2 text-[#8C8880] hover:text-[#C9A461] transition-colors relative focus:outline-none" aria-label="Shopping Cart">
                            <ShoppingBag className="w-5 h-5 stroke-[1.5px]" />
                            <AnimatePresence>
                                {mounted && cartCount > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        className="absolute top-1 right-0 bg-[#C9A461] text-[#0B0B0D] text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full ring-2 ring-[#0B0B0D]"
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
                mounted={mounted}
                onSignOut={handleSignOut}
            />
        </>
    );
}
