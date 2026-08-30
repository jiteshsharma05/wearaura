"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import Link from "next/link";
import { useAuth } from "../../components/AuthProvider";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface WishlistItem {
    id: string;
    product: {
        id: string;
        name: string;
        price: number;
        image_url: string | null;
    images?: string[];
        category: string | null;
    };
}

export default function WishlistPage() {
    const [items, setItems] = useState<WishlistItem[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) return;

        const fetchWishlist = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from("wishlist")
                .select(`
          id,
          product:product_id (
            id, name, price, image_url, images, category
          )
        `)
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });

            if (error) {
                toast.error("Failed to fetch wishlist");
            } else {
                setItems((data as unknown as WishlistItem[]) || []);
            }
            setLoading(false);
        };

        fetchWishlist();
    }, [user]);

    const handleRemove = async (productId: string) => {
        if (!user) return;

        const { error } = await supabase
            .from("wishlist")
            .delete()
            .eq("product_id", productId)
            .eq("user_id", user.id);

        if (error) {
            toast.error("Failed to remove item");
        } else {
            setItems(items.filter(item => item.product.id !== productId));
            toast.success("Removed from wishlist");
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 px-4 py-16 flex justify-center items-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-8 w-8 bg-zinc-200 dark:bg-zinc-800 rounded-full mb-4"></div>
                    <p className="text-zinc-500 dark:text-zinc-400 font-medium tracking-tight">Loading your wishlist...</p>
                </div>
            </main>
        );
    }

    if (!user) {
        router.push("/login");
        return null;
    }

    return (
        <main className="min-h-screen bg-white dark:bg-zinc-950 px-4 py-12 md:py-20">
            <div className="container mx-auto max-w-7xl">
                <div className="mb-12">
                    <h1 className="text-4xl font-light text-zinc-900 dark:text-zinc-100 tracking-tight mb-3">Your Wishlist</h1>
                    <p className="text-zinc-500 dark:text-zinc-400">Products you&apos;ve saved for later.</p>
                </div>

                {items.length === 0 ? (
                    <div className="text-center py-20 bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800">
                        <svg className="mx-auto h-12 w-12 text-zinc-400 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <h2 className="text-xl font-medium text-zinc-900 dark:text-zinc-100 mb-4 tracking-tight">Your wishlist is empty</h2>
                        <p className="text-zinc-500 dark:text-zinc-400 mb-8 max-w-sm mx-auto">Explore our collection and save your favorite fragrances to find them easily later.</p>
                        <Link href="/" className="inline-flex items-center justify-center rounded-full bg-zinc-900 dark:bg-zinc-100 px-8 py-3 text-sm font-medium text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-white transition-all transform active:scale-95">
                            Browse Collection
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
                        {items.map((item) => (
                            <div key={item.id} className="group flex flex-col relative">
                                <Link href={`/products/${item.product.id}`} className="block relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 mb-4">
                                    {item.product.images && item.product.images.length > 0 ? item.product.images[0] : item.product.image_url ? (
                                        <img
                                            src={(item.product.images && item.product.images.length > 0) ? item.product.images[0] : (item.product.image_url || "")}
                                            alt={item.product.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400">
                                            <svg className="w-8 h-8 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}
                                </Link>

                                <button
                                    onClick={() => handleRemove(item.product.id)}
                                    className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md shadow-sm border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-red-500 transition-all transform hover:scale-110 active:scale-90"
                                    title="Remove from wishlist"
                                >
                                    <svg className="w-4 h-4 fill-current stroke-current" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </button>

                                <div className="flex flex-col flex-1 px-1">
                                    {item.product.category && (
                                        <p className="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">{item.product.category}</p>
                                    )}
                                    <Link href={`/products/${item.product.id}`}>
                                        <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-1 leading-tight hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
                                            {item.product.name}
                                        </h2>
                                    </Link>
                                    <p className="text-zinc-900 dark:text-zinc-100 font-medium tracking-tight mt-auto">
                                        ₹{Number(item.product.price).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
