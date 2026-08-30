"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../components/AuthProvider";
import { supabase } from "../../../lib/supabase";
import { Package, Search, ChevronDown, ShoppingBag } from "lucide-react";

interface OrderProduct {
    id: string;
    name: string;
    image_url: string | null;
    images?: string[];
}

interface OrderItem {
    id: string;
    quantity: number;
    price: number;
    product_id: string;
    products: OrderProduct;
}

interface Order {
    id: string;
    user_id: string;
    total_amount: number;
    status: 'pending' | 'paid' | 'cod_pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'failed';
    payment_method: 'razorpay' | 'cod' | null;
    razorpay_payment_id: string | null;
    created_at: string;
    order_items: OrderItem[];
}

export default function MyOrdersPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [ordersLoading, setOrdersLoading] = useState(true);
    
    // Filters and sorting
    const [filterTab, setFilterTab] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'total_desc' | 'total_asc'>('date_desc');
    const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login?redirect=/my-orders");
        }
    }, [user, loading, router]);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) return;

            try {
                setOrdersLoading(true);
                const { data, error } = await supabase
                    .from('orders')
                    .select(`
                        id, 
                        user_id, 
                        total_amount, 
                        status, 
                        payment_method,
                        razorpay_payment_id,
                        created_at,
                        order_items (
                            id, 
                            quantity, 
                            price, 
                            product_id,
                            products (
                                id,
                                name,
                                image_url
                            )
                        )
                    `)
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (error) {
                    console.error("Error fetching orders:", error);
                } else {
                    setOrders(data as unknown as Order[] || []);
                }
            } catch (err) {
                console.error("Unexpected error fetching orders:", err);
            } finally {
                setOrdersLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    // Apply filtering and sorting
    const filteredAndSortedOrders = orders
        .filter(order => {
            if (filterTab === 'active') return ['pending', 'paid', 'cod_pending', 'processing', 'shipped'].includes(order.status);
            if (filterTab === 'completed') return order.status === 'delivered';
            if (filterTab === 'cancelled') return ['cancelled', 'failed'].includes(order.status);
            return true;
        })
        .filter(order => {
            if (!searchQuery.trim()) return true;
            const searchLower = searchQuery.toLowerCase();
            return order.id.toLowerCase().includes(searchLower) || 
                   order.order_items?.some(item => item.products?.name?.toLowerCase().includes(searchLower));
        })
        .sort((a, b) => {
            if (sortBy === 'date_desc') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            if (sortBy === 'date_asc') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
            if (sortBy === 'total_desc') return b.total_amount - a.total_amount;
            if (sortBy === 'total_asc') return a.total_amount - b.total_amount;
            return 0;
        });

    if (loading || (!user && !loading) || ordersLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-8 w-8 rounded-full border-t-2 border-[#1a1a1a] animate-spin mb-4"></div>
                </div>
            </div>
        );
    }

    const getStatusBadgeColors = (status: string) => {
        switch (status) {
            case 'delivered': return 'bg-[#e2f0e6] text-[#2d6a4f] border-[#b7dcc4]';
            case 'shipped': return 'bg-[#e6f0ff] text-[#003d99] border-[#b3d1ff]';
            case 'processing': return 'bg-[#fff8e6] text-[#997300] border-[#ffe699]';
            case 'cancelled': return 'bg-[#ffe6e6] text-[#990000] border-[#ffb3b3]';
            case 'paid': return 'bg-[#e2f0e6] text-[#2d6a4f] border-[#b7dcc4]';
            case 'cod_pending': return 'bg-[#fff3e6] text-[#994d00] border-[#ffd699]';
            case 'failed': return 'bg-[#ffe6e6] text-[#990000] border-[#ffb3b3]';
            default: return 'bg-[#f0eeea] text-[#4a4a4a] border-[#e8e6e1]'; // pending
        }
    };

    const getPaymentMethodLabel = (method: string | null) => {
        switch (method) {
            case 'razorpay': return 'Online';
            case 'cod': return 'COD';
            default: return '';
        }
    };

    return (
        <div className="min-h-screen bg-[#FAF9F6] pt-[72px] md:pt-[96px] pb-[64px] md:pb-[96px] font-sans text-[#1a1a1a]">
            
            {/* PAGE HEADER */}
            <div className="bg-[#FAF9F6] border-b border-[#e8e6e1] pb-6 px-4 sm:px-6 lg:px-8 mb-8 sticky top-[72px] md:top-[80px] z-40 bg-opacity-95 backdrop-blur-sm">
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pt-8">
                        <h1 className="text-4xl md:text-5xl font-serif text-[#1a1a1a] tracking-tight">
                            My Orders
                        </h1>
                        
                        {/* Search Input */}
                        <div className="relative w-full md:w-64 transform translate-y-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-[#8a8a8a]" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search orders..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2 border border-[#e8e6e1] rounded-[2px] leading-5 bg-white placeholder-[#8a8a8a] focus:outline-none focus:ring-1 focus:ring-[#1a1a1a] focus:border-[#1a1a1a] sm:text-sm transition-colors"
                            />
                        </div>
                    </div>

                    {/* Filter Tabs & Sort */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex overflow-x-auto hide-[::-webkit-scrollbar] space-x-1 border-b border-[#e8e6e1] w-full sm:w-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                            {(['all', 'active', 'completed', 'cancelled'] as const).map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setFilterTab(tab)}
                                    className={`whitespace-nowrap py-3 px-4 text-sm font-medium border-b-2 transition-colors focus:outline-none capitalize ${
                                        filterTab === tab
                                            ? 'border-[#1a1a1a] text-[#1a1a1a]'
                                            : 'border-transparent text-[#8a8a8a] hover:text-[#4a4a4a] hover:border-[#e8e6e1]'
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Sort Dropdown */}
                        <div className="relative inline-block text-left w-full sm:w-auto flex-shrink-0">
                            <button 
                                onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                                className="inline-flex justify-between w-full sm:w-auto rounded-[2px] border border-[#e8e6e1] shadow-sm px-4 py-2 bg-white text-sm font-medium text-[#4a4a4a] hover:bg-[#f0eeea] focus:outline-none transition-colors"
                            >
                                Sort by: {sortBy === 'date_desc' ? 'Newest' : sortBy === 'date_asc' ? 'Oldest' : sortBy === 'total_desc' ? 'Price (High-Low)' : 'Price (Low-High)'}
                                <ChevronDown className="-mr-1 ml-2 h-5 w-5" />
                            </button>
                            {isSortDropdownOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setIsSortDropdownOpen(false)}></div>
                                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-[4px] shadow-lg bg-white border border-[#e8e6e1] ring-1 ring-black ring-opacity-5 z-20">
                                        <div className="py-1" role="menu" aria-orientation="vertical">
                                            {[
                                                { id: 'date_desc', label: 'Newest First' },
                                                { id: 'date_asc', label: 'Oldest First' },
                                                { id: 'total_desc', label: 'Price: High to Low' },
                                                { id: 'total_asc', label: 'Price: Low to High' }
                                            ].map((option) => (
                                                <button
                                                    key={option.id}
                                                    onClick={() => { setSortBy(option.id as 'date_desc' | 'date_asc' | 'total_desc' | 'total_asc'); setIsSortDropdownOpen(false); }}
                                                    className={`block w-full text-left px-4 py-2 text-sm ${sortBy === option.id ? 'bg-[#f0eeea] text-[#1a1a1a] font-medium' : 'text-[#4a4a4a] hover:bg-[#FAF9F6]'} transition-colors`}
                                                    role="menuitem"
                                                >
                                                    {option.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="space-y-4">
                    {filteredAndSortedOrders.length === 0 ? (
                        <div className="bg-white rounded-[4px] border border-[#e8e6e1] p-12 text-center shadow-sm">
                            <div className="mx-auto w-16 h-16 bg-[#f0eeea] rounded-full flex items-center justify-center mb-4 border border-[#e8e6e1]">
                                <ShoppingBag className="w-8 h-8 text-[#8a8a8a]" />
                            </div>
                            <h3 className="text-xl font-serif text-[#1a1a1a] mb-2 tracking-wide">No orders found</h3>
                            <p className="text-[#8a8a8a] text-sm mb-6 max-w-sm mx-auto">
                                {searchQuery ? "We couldn't find any orders matching your current filters." : "You haven't placed any orders yet. Discover our latest collections."}
                            </p>
                            {searchQuery || filterTab !== 'all' ? (
                                <button
                                    onClick={() => { setFilterTab('all'); setSearchQuery(''); }}
                                    className="inline-flex items-center justify-center rounded-[2px] bg-[#f0eeea] px-6 py-2.5 text-sm font-medium text-[#1a1a1a] hover:bg-[#e8e6e1] transition-colors"
                                >
                                    Clear Filters
                                </button>
                            ) : (
                                <button
                                    onClick={() => router.push('/#collection')}
                                    className="inline-flex items-center justify-center rounded-[2px] bg-[#1a1a1a] px-8 py-3 text-sm font-medium text-white hover:bg-[#333] transition-colors shadow-sm"
                                >
                                    Start Shopping
                                </button>
                            )}
                        </div>
                    ) : (
                        filteredAndSortedOrders.map((order) => {
                            // Extract max 3 items for thumbnails
                            const orderItems = order.order_items || [];
                            const thumbnails = orderItems.slice(0, 3);
                            const remainingCount = Math.max(0, orderItems.length - 3);

                            return (
                                <div key={order.id} className="bg-white shadow-sm hover:shadow-md transition-shadow rounded-[4px] overflow-hidden border border-[#e8e6e1] p-6 flex flex-col md:flex-row md:items-center gap-6 group">
                                    
                                    {/* Info Left */}
                                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-sans font-medium text-lg text-[#1a1a1a]">
                                                    Order #{order.id.split('-')[0].toUpperCase()}
                                                </h3>
                                                <span className={`px-2.5 py-0.5 rounded-[2px] border text-[11px] font-medium tracking-wide uppercase ${getStatusBadgeColors(order.status)}`}>
                                                    {order.status === 'cod_pending' ? 'COD Pending' : order.status}
                                                </span>
                                                {order.payment_method && (
                                                    <span className="px-2 py-0.5 rounded-[2px] text-[10px] font-medium tracking-wide uppercase bg-gray-100 text-gray-500 border border-gray-200">
                                                        {getPaymentMethodLabel(order.payment_method)}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-[#8a8a8a] text-sm">
                                                Placed on {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </p>
                                        </div>

                                        {/* Thumbnails */}
                                        <div className="flex items-center gap-2 mt-4 sm:mt-0">
                                            {thumbnails.map((item, idx) => (
                                                <div key={idx} className="w-12 h-12 bg-[#f0eeea] rounded-[2px] border border-[#e8e6e1] overflow-hidden flex-shrink-0 relative">
                                                    {item.products?.image_url ? (
                                                        <img
                                                            src={(item.products.images && item.products.images.length > 0) ? item.products.images[0] : (item.products.image_url || "")}
                                                            alt={item.products.name || 'Product'}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <Package className="w-5 h-5 text-[#8a8a8a] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                                                    )}
                                                </div>
                                            ))}
                                            {remainingCount > 0 && (
                                                <div className="w-12 h-12 bg-[#f0eeea] rounded-[2px] border border-[#e8e6e1] flex items-center justify-center text-xs font-medium text-[#4a4a4a]">
                                                    +{remainingCount}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="hidden md:block w-px h-16 bg-[#e8e6e1]"></div>

                                    {/* Action Right */}
                                    <div className="flex flex-row md:flex-col justify-between items-center md:items-end gap-4 md:gap-2">
                                        <div className="text-left md:text-right">
                                            <p className="text-xs text-[#8a8a8a] uppercase tracking-wider mb-1">Total</p>
                                            <p className="text-xl font-serif text-[#1a1a1a]">₹{Number(order.total_amount).toFixed(2)}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            {order.status === 'delivered' && (
                                                <button className="hidden sm:block px-4 py-2 border border-[#e8e6e1] text-[#4a4a4a] hover:bg-[#f0eeea] hover:text-[#1a1a1a] rounded-[2px] text-xs font-medium transition-colors">
                                                    Reorder
                                                </button>
                                            )}
                                            {['shipped', 'processing'].includes(order.status) && (
                                                <button className="hidden sm:block px-4 py-2 border border-[#e8e6e1] text-[#4a4a4a] hover:bg-[#f0eeea] hover:text-[#1a1a1a] rounded-[2px] text-xs font-medium transition-colors">
                                                    Track Order
                                                </button>
                                            )}
                                            <button className="px-4 py-2 bg-[#1a1a1a] text-white hover:bg-[#333] rounded-[2px] text-xs font-medium transition-colors shadow-sm">
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                    
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
