"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../components/AuthProvider";
import { supabase } from "../../../lib/supabase";
import { ShoppingBag, Settings, MapPin, Heart, Package, MessageSquare, RefreshCcw } from "lucide-react";
import { isAdminEmail } from "../../../lib/adminConfig";

interface Profile {
    id: string;
    role: string | null;
}

export default function AccountPage() {
    const { user, loading, signOut } = useAuth();
    const router = useRouter();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [profileLoading, setProfileLoading] = useState(true);
    const [stats, setStats] = useState({ orders: 0, wishlist: 0 });

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login?redirect=/account");
        }
    }, [user, loading, router]);

    useEffect(() => {
        if (user) {
            const fetchData = async () => {
                try {
                    // Fetch Profile for Admin check alone
                    const { data: profileData } = await supabase
                        .from("profiles")
                        .select("id, role")
                        .eq("id", user.id)
                        .single();

                    if (profileData) {
                        if (isAdminEmail(user.email)) {
                            profileData.role = 'admin';
                        }
                        setProfile(profileData);
                    } else if (isAdminEmail(user.email)) {
                        setProfile({ id: user.id, role: 'admin' });
                    }

                    // Fetch Orders Count
                    const { count: ordersCount } = await supabase
                        .from("orders")
                        .select("*", { count: 'exact', head: true })
                        .eq("user_id", user.id);

                    // Fetch Wishlist Count
                    const { count: wishlistCount } = await supabase
                        .from("wishlist")
                        .select("*", { count: 'exact', head: true })
                        .eq("user_id", user.id);

                    setStats({
                        orders: ordersCount || 0,
                        wishlist: wishlistCount || 0
                    });

                } catch (err) {
                    console.error("Unexpected error fetching data:", err);
                } finally {
                    setProfileLoading(false);
                }
            };

            fetchData();
        }
    }, [user]);

    if (loading || (!user && !loading) || profileLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-8 w-8 rounded-full border-t-2 border-[#1a1a1a] animate-spin mb-4"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAF9F6] pt-[64px] md:pt-[80px] pb-[64px] md:pb-[96px] font-sans text-[#1a1a1a]">
            {/* HERO SECTION */}
            <div className="bg-gradient-to-r from-[#2d1b3d] via-[#3d2a4d] to-[#4a3558] py-16 px-4 sm:px-6 lg:px-8 mb-12 shadow-sm">
                <div className="max-w-6xl mx-auto text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-serif text-[#FAF9F6] mb-2 tracking-tight">
                        My Account
                    </h1>
                    <p className="text-[#c4a8d4] text-[16px] md:text-lg max-w-2xl font-sans">
                        Welcome back. Manage your preferences and track your orders.
                    </p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px]">
                    
                    {/* 1. PROFILE INFORMATION CARD */}
                    <div className="bg-white rounded-[4px] shadow-sm border border-[#e8e6e1] p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 rounded-full bg-[#f0eeea] flex items-center justify-center text-xl font-serif text-[#1a1a1a] border flex-shrink-0 border-[#e8e6e1]">
                                {user?.email?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="overflow-hidden">
                                <h2 className="text-xl font-serif text-[#1a1a1a] truncate">{user?.email?.split('@')[0]}</h2>
                                <p className="text-sm text-[#8a8a8a] truncate">{user?.email}</p>
                            </div>
                        </div>
                        <button className="w-full py-2.5 px-4 bg-[#f0eeea] hover:bg-[#e8e6e1] text-[#1a1a1a] text-sm font-medium transition-colors rounded-[2px]">
                            Edit Profile
                        </button>
                    </div>

                    {/* 2. ORDER SUMMARY CARD */}
                    <div className="bg-white rounded-[4px] shadow-sm border border-[#e8e6e1] p-6 hover:shadow-md transition-shadow flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-4 text-[#1a1a1a]">
                                <ShoppingBag className="w-5 h-5" />
                                <h3 className="font-serif text-lg tracking-wide">My Orders</h3>
                            </div>
                            <p className="text-3xl font-light text-[#1a1a1a] mb-1">{stats.orders}</p>
                            <p className="text-sm text-[#8a8a8a] mb-6">Total orders placed</p>
                        </div>
                        <Link href="/my-orders" className="w-full inline-block text-center py-2.5 px-4 bg-[#1a1a1a] hover:bg-[#333] text-white text-sm font-medium transition-colors rounded-[2px]">
                            View All Orders
                        </Link>
                    </div>

                    {/* 3. WISHLIST CARD */}
                    <div className="bg-white rounded-[4px] shadow-sm border border-[#e8e6e1] p-6 hover:shadow-md transition-shadow flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-4 text-[#1a1a1a]">
                                <Heart className="w-5 h-5" />
                                <h3 className="font-serif text-lg tracking-wide">Wishlist</h3>
                            </div>
                            <p className="text-3xl font-light text-[#1a1a1a] mb-1">{stats.wishlist}</p>
                            <p className="text-sm text-[#8a8a8a] mb-6">Saved items</p>
                        </div>
                        <Link href="/" className="w-full inline-block text-center py-2.5 px-4 bg-[#f0eeea] hover:bg-[#e8e6e1] text-[#1a1a1a] text-sm font-medium transition-colors rounded-[2px]">
                            View Wishlist
                        </Link>
                    </div>

                    {/* 4. ACCOUNT SETTINGS CARD */}
                    <div className="bg-white rounded-[4px] shadow-sm border border-[#e8e6e1] p-6 hover:shadow-md transition-shadow md:col-span-2 lg:col-span-1 border-t-2 border-t-[#c4a8d4]">
                        <div className="flex items-center gap-2 mb-6 text-[#1a1a1a]">
                            <Settings className="w-5 h-5" />
                            <h3 className="font-serif text-lg tracking-wide">Settings</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-[#4a4a4a]">Email Notifications</span>
                                <div className="w-10 h-6 bg-[#2d1b3d] rounded-full relative cursor-pointer">
                                    <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1 shadow-sm"></div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-[#4a4a4a]">Order Updates</span>
                                <div className="w-10 h-6 bg-[#2d1b3d] rounded-full relative cursor-pointer">
                                    <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1 shadow-sm"></div>
                                </div>
                            </div>
                            <button className="text-sm font-medium text-[#1a1a1a] hover:underline decoration-1 underline-offset-4 hover:text-[#4a4a4a] pt-2">
                                Change Password
                            </button>
                        </div>
                    </div>

                    {/* 5. SHIPPING ADDRESSES & QUICK ACTIONS */}
                    <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-[24px]">
                        
                        <div className="bg-white rounded-[4px] shadow-sm border border-[#e8e6e1] p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-2 mb-4 text-[#1a1a1a]">
                                <MapPin className="w-5 h-5" />
                                <h3 className="font-serif text-lg tracking-wide">Shipping</h3>
                            </div>
                            <div className="bg-[#FAF9F6] border border-[#e8e6e1] p-4 rounded-[2px] mb-4 text-sm text-[#4a4a4a]">
                                <p className="font-medium text-[#1a1a1a] mb-1 font-sans">Default Address</p>
                                <p>No default address saved.</p>
                            </div>
                            <button className="text-sm font-medium text-[#1a1a1a] hover:underline decoration-1 underline-offset-4 hover:text-[#4a4a4a]">
                                Manage Addresses
                            </button>
                        </div>

                        <div className="bg-gradient-to-br from-[#2d1b3d] to-[#1a1a1a] text-[#FAF9F6] rounded-[4px] shadow-sm border border-[#3d2a4d] p-6 hover:shadow-md transition-shadow flex flex-col justify-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-5 rounded-full -translate-y-12 translate-x-12 blur-2xl"></div>
                            <h3 className="font-serif text-lg mb-6 relative z-10 tracking-wide text-white">Quick Actions</h3>
                            <div className="space-y-4 relative z-10">
                                <Link href="/contact" className="flex items-center gap-3 text-sm text-[#c4a8d4] hover:text-white transition-colors">
                                    <MessageSquare className="w-4 h-4" /> Contact Support
                                </Link>
                                <Link href="/my-orders" className="flex items-center gap-3 text-sm text-[#c4a8d4] hover:text-white transition-colors">
                                    <Package className="w-4 h-4" /> Track an Order
                                </Link>
                                <Link href="/contact" className="flex items-center gap-3 text-sm text-[#c4a8d4] hover:text-white transition-colors">
                                    <RefreshCcw className="w-4 h-4" /> Returns & Exchanges
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>

                {/* BOTTOM ACTIONS */}
                <div className="mt-12 pt-6 border-t border-[#e8e6e1] flex flex-wrap gap-4 items-center justify-between">
                    {profile?.role === 'admin' && (
                        <Link
                            href="/admin"
                            className="py-2.5 px-6 bg-[#f0eeea] border border-[#e8e6e1] text-[#1a1a1a] hover:bg-[#e8e6e1] transition-colors rounded-[2px] text-sm font-medium shadow-sm"
                        >
                            Admin Dashboard
                        </Link>
                    )}
                    
                    <button
                        onClick={async () => {
                            await signOut();
                            router.push("/");
                        }}
                        className="py-2.5 px-6 border border-[#e8e6e1] text-[#4a4a4a] hover:bg-[#e8e6e1] hover:text-[#1a1a1a] transition-colors rounded-[2px] text-sm font-medium shadow-sm ml-auto"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
}
