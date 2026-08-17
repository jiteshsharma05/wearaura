"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../components/AuthProvider";
import { supabase } from "../../../lib/supabase";
import toast from "react-hot-toast";
import { LayoutDashboard, ShoppingBag, Package as PackageIcon, MessageSquare, Settings as SettingsIcon, Menu, X, DollarSign, TrendingUp, ChevronDown, Check, Trash2, Edit2, Users, Upload, Image as LucideImage } from "lucide-react";
import Image from "next/image";
import { uploadImageToCloudinary } from '@/components/utils/cloudinaryUpload';
import HeroManagement from "./HeroManagement";

interface Profile {
    id: string;
    role: string | null;
}

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    image_url: string;
    images?: string[];
    status: string;
}

interface OrderProduct {
    id: string;
    name: string;
    image_url: string | null;
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
    status: string;
    payment_method: string | null;
    razorpay_payment_id: string | null;
    created_at: string;
    order_items: OrderItem[];
}

interface Review {
    id: string;
    product_id: string;
    user_id: string;
    rating: number;
    comment: string;
    created_at: string;
    products: { name: string } | null;
}

export default function AdminPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [profileLoading, setProfileLoading] = useState(true);
    const [products, setProducts] = useState<Product[]>([]);
    const [productsLoading, setProductsLoading] = useState(true);

    // Sidebar State
    const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'products' | 'reviews' | 'hero'>('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Create Product state
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: '',
        image_url: '',
        stock: '0',
        status: 'available',
    });
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Delete state
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Edit state
    const [editingProductId, setEditingProductId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<{
        name: string;
        description: string;
        price: string;
        stock: string;
        image_url: string;
        images: string[];
        status: string;
    }>({
        name: '',
        description: '',
        price: '',
        stock: '0',
        image_url: '',
        images: [],
        status: 'available'
    });
    const [editImageFiles, setEditImageFiles] = useState<File[]>([]);
    const [editImagePreviews, setEditImagePreviews] = useState<string[]>([]);

    const [isSavingEdit, setIsSavingEdit] = useState(false);

    // Orders state
    const [orders, setOrders] = useState<Order[]>([]);
    const [ordersLoading, setOrdersLoading] = useState(true);
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
    const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

    // Reviews state
    const [reviews, setReviews] = useState<Review[]>([]);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);

    const fetchProducts = async () => {
        try {
            setProductsLoading(true);
            const { data, error } = await supabase
                .from('products')
                .select('id, name, description, price, stock, image_url, images, status')
                .order('id', { ascending: false });

            if (error) console.error("Error fetching products:", error);
            else setProducts(data || []);
        } catch (err) {
            console.error("Unexpected error fetching products:", err);
        } finally {
            setProductsLoading(false);
        }
    };

    const fetchOrders = async () => {
        try {
            setOrdersLoading(true);
            const { data, error } = await supabase
                .from('orders')
                .select(`id, user_id, total_amount, status, payment_method, razorpay_payment_id, created_at, order_items (id, quantity, price, product_id, products (id, name, image_url))`)
                .order('created_at', { ascending: false });

            if (error) console.error("Error fetching orders:", error);
            else setOrders(data as unknown as Order[] || []);
        } catch (err) {
            console.error("Unexpected error fetching orders:", err);
        } finally {
            setOrdersLoading(false);
        }
    };

    const fetchReviews = async () => {
        try {
            setReviewsLoading(true);
            const { data, error } = await supabase
                .from('reviews')
                .select(`id, rating, comment, created_at, product_id, user_id, products (name)`)
                .order('created_at', { ascending: false });

            if (error) console.error("Error fetching reviews:", error);
            else setReviews(data as unknown as Review[] || []);
        } catch (err) {
            console.error("Unexpected error fetching reviews:", err);
        } finally {
            setReviewsLoading(false);
        }
    };

    useEffect(() => {
        if (!loading && !user) router.push("/login");
    }, [user, loading, router]);

    useEffect(() => {
        if (user) {
            const fetchProfile = async () => {
                try {
                    const { data, error } = await supabase
                        .from("profiles")
                        .select("id, role")
                        .eq("id", user.id)
                        .single();

                    if (error || data?.role !== 'admin') {
                        router.push("/");
                    } else {
                        setProfile(data);
                    }
                } catch (err) {
                    router.push("/");
                } finally {
                    setProfileLoading(false);
                }
            };
            fetchProfile();
        }
    }, [user, router]);

    useEffect(() => {
        if (profile?.role === 'admin') {
            fetchProducts();
            fetchOrders();
            fetchReviews();
        }
    }, [profile?.role]);

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            let finalImageUrl = newProduct.image_url;
            let uploadedImages: string[] = [];

            if (imageFiles && imageFiles.length > 0) {
                try {
                    const uploadPromises = imageFiles.map(file => uploadImageToCloudinary(file));
                    uploadedImages = await Promise.all(uploadPromises);
                    if (uploadedImages.length > 0) {
                        finalImageUrl = uploadedImages[0];
                    }
                } catch (uploadError: any) {
                    toast.error(`Error uploading image: ${uploadError.message}`);
                    setIsSubmitting(false);
                    return;
                }
            }

            const { error } = await supabase
                .from('products')
                .insert([{
                    name: newProduct.name,
                    description: newProduct.description,
                    price: parseFloat(newProduct.price),
                    stock: parseInt(newProduct.stock, 10),
                    image_url: finalImageUrl || null,
                    images: uploadedImages,
                    status: newProduct.status,
                }]);

            if (error) {
                toast.error(`Error adding product: ${error.message}`);
                return;
            }

            toast.success('Product added successfully!');
            setNewProduct({ name: '', description: '', price: '', stock: '0', image_url: '', status: 'available' });
            setImageFiles([]);
            setImagePreviews([]);
            fetchProducts();
        } catch (err: any) {
            toast.error(err.message || 'Error occurred while adding product');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);
            setImageFiles(prev => [...prev, ...files]);
            setImagePreviews(prev => [...prev, ...files.map(file => URL.createObjectURL(file))]);
        }
    };

    const removeNewImage = (index: number) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);
            setEditImageFiles(prev => [...prev, ...files]);
            setEditImagePreviews(prev => [...prev, ...files.map(file => URL.createObjectURL(file))]);
        }
    };

    const removeEditImage = (index: number) => {
        setEditImageFiles(prev => prev.filter((_, i) => i !== index));
        setEditImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingEditImage = (index: number) => {
        setEditForm(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleDeleteProduct = async (productId: string) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        setDeletingId(productId);
        try {
            const { error } = await supabase.from('products').delete().eq('id', productId);
            if (error) toast.error(`Error deleting: ${error.message}`);
            else {
                toast.success('Product deleted successfully');
                setProducts(products.filter(p => p.id !== productId));
            }
        } catch (err: any) {
            toast.error(err.message || 'Error deleting product');
        } finally {
            setDeletingId(null);
        }
    };

    const handleEditClick = (product: Product) => {
        setEditingProductId(product.id);
        setEditForm({
            name: product.name,
            description: product.description || '',
            price: product.price.toString(),
            stock: product.stock.toString(),
            image_url: product.image_url || '',
            images: product.images || (product.image_url ? [product.image_url] : []),
            status: product.status || 'available'
        });
        setEditImageFiles([]);
        setEditImagePreviews([]);
    };

    const handleCancelEdit = () => {
        setEditingProductId(null);
    };

    const handleSaveEdit = async (productId: string) => {
        setIsSavingEdit(true);
        try {
            let uploadedImages = [...editForm.images];
            if (editImageFiles.length > 0) {
                const uploadPromises = editImageFiles.map(file => uploadImageToCloudinary(file));
                const newUrls = await Promise.all(uploadPromises);
                uploadedImages = [...uploadedImages, ...newUrls];
            }
            const finalImageUrl = uploadedImages.length > 0 ? uploadedImages[0] : null;

            const { error } = await supabase
                .from('products')
                .update({
                    name: editForm.name,
                    description: editForm.description,
                    price: parseFloat(editForm.price),
                    stock: parseInt(editForm.stock, 10),
                    image_url: finalImageUrl,
                    images: uploadedImages,
                    status: editForm.status,
                })
                .eq('id', productId);

            if (error) toast.error(`Error updating product: ${error.message}`);
            else {
                toast.success('Product updated successfully');
                setEditingProductId(null);
                fetchProducts();
            }
        } catch (err: any) {
            toast.error(err.message || 'Error updating product');
        } finally {
            setIsSavingEdit(false);
        }
    };

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        setUpdatingOrderId(orderId);
        try {
            const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
            if (error) toast.error(`Error updating order status: ${error.message}`);
            else {
                toast.success(`Order status updated`);
                setOrders(orders.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
            }
        } catch (err: any) {
            toast.error(err.message || 'Error updating order status');
        } finally {
            setUpdatingOrderId(null);
        }
    };

    const handleDeleteReview = async (reviewId: string) => {
        if (!window.confirm("Are you sure you want to delete this review?")) return;
        setDeletingReviewId(reviewId);
        try {
            const { error } = await supabase.from('reviews').delete().eq('id', reviewId);
            if (error) toast.error(`Error deleting review: ${error.message}`);
            else {
                toast.success('Review deleted successfully');
                setReviews(reviews.filter(r => r.id !== reviewId));
            }
        } catch (err: any) {
            toast.error(err.message || 'Error deleting review');
        } finally {
            setDeletingReviewId(null);
        }
    };

    if (loading || (!user && !loading) || profileLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-8 w-8 rounded-full border-t-2 border-[#1a1a1a] animate-spin mb-4"></div>
                </div>
            </div>
        );
    }

    if (profile?.role !== 'admin') return null;

    const renderDashboard = () => {
        const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0);
        return (
            <div className="space-y-8 animate-in fade-in duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-[4px] border border-[#e8e6e1] p-6 shadow-sm flex items-center gap-4">
                        <div className="p-4 bg-[#f0eeea] rounded-full text-[#1a1a1a]">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-[#8a8a8a] font-medium">Total Revenue</p>
                            <p className="text-2xl font-serif text-[#1a1a1a]">₹{totalRevenue.toFixed(2)}</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-[4px] border border-[#e8e6e1] p-6 shadow-sm flex items-center gap-4">
                        <div className="p-4 bg-[#f0eeea] rounded-full text-[#1a1a1a]">
                            <ShoppingBag className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-[#8a8a8a] font-medium">Total Orders</p>
                            <p className="text-2xl font-serif text-[#1a1a1a]">{orders.length}</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-[4px] border border-[#e8e6e1] p-6 shadow-sm flex items-center gap-4">
                        <div className="p-4 bg-[#f0eeea] rounded-full text-[#1a1a1a]">
                            <PackageIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-[#8a8a8a] font-medium">Products Sold</p>
                            <p className="text-2xl font-serif text-[#1a1a1a]">
                                {orders.reduce((acc, order) => acc + order.order_items.reduce((sum, item) => sum + item.quantity, 0), 0)}
                            </p>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-[#2d1b3d] to-[#1a1a1a] rounded-[4px] border border-[#3d2a4d] p-6 shadow-sm flex items-center gap-4 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-5 rounded-full -translate-y-4 translate-x-4 blur-xl"></div>
                        <div className="p-4 bg-white/10 rounded-full text-[#FAF9F6] relative z-10">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <div className="relative z-10">
                            <p className="text-sm text-[#c4a8d4] font-medium">Recent Activity</p>
                            <p className="text-2xl font-serif text-[#FAF9F6]">+{orders.filter(o => new Date(o.created_at).getDate() === new Date().getDate()).length} Today</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[4px] border border-[#e8e6e1] shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-[#e8e6e1] bg-[#FAF9F6]">
                        <h3 className="font-serif text-xl tracking-wide text-[#1a1a1a]">Recent Orders</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-[#f0eeea] text-[#8a8a8a]">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Order ID</th>
                                    <th className="px-6 py-4 font-medium">Date</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#e8e6e1]">
                                {orders.slice(0, 5).map(order => (
                                    <tr key={order.id} className="hover:bg-[#f0eeea]/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-[#1a1a1a]">#{order.id.slice(0,8).toUpperCase()}</td>
                                        <td className="px-6 py-4 text-[#4a4a4a]">{new Date(order.created_at).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 text-[11px] uppercase tracking-wider bg-[#f0eeea] text-[#1a1a1a] rounded-[2px]">{order.status}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right text-[#1a1a1a] font-medium">₹{Number(order.total_amount).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    const renderOrders = () => {
        return (
            <div className="space-y-8 animate-in fade-in duration-500">
                <div className="bg-white rounded-[4px] border border-[#e8e6e1] shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-[#e8e6e1] bg-[#FAF9F6]">
                        <h3 className="font-serif text-xl tracking-wide text-[#1a1a1a]">All Orders</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-[#f0eeea] text-[#8a8a8a]">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Order ID</th>
                                    <th className="px-6 py-4 font-medium">Total Amount</th>
                                    <th className="px-6 py-4 font-medium">Payment</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium">Created Date</th>
                                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#e8e6e1]">
                                {orders.map(order => (
                                    <React.Fragment key={order.id}>
                                        <tr className="hover:bg-[#f0eeea]/50 transition-colors group">
                                            <td className="px-6 py-4 font-medium text-[#1a1a1a]">#{order.id.slice(0,8).toUpperCase()}</td>
                                            <td className="px-6 py-4 text-[#1a1a1a] font-medium">₹{Number(order.total_amount).toFixed(2)}</td>
                                            <td className="px-6 py-4">
                                                {order.payment_method === 'razorpay' ? (
                                                    <span className="px-2 py-0.5 rounded-[2px] text-[10px] font-medium tracking-wide uppercase bg-blue-50 text-blue-600 border border-blue-100">Online</span>
                                                ) : order.payment_method === 'cod' ? (
                                                    <span className="px-2 py-0.5 rounded-[2px] text-[10px] font-medium tracking-wide uppercase bg-amber-50 text-amber-600 border border-amber-100">COD</span>
                                                ) : <span className="text-gray-400">-</span>}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                        disabled={updatingOrderId === order.id}
                                                        className="block w-32 rounded-[2px] border border-[#e8e6e1] bg-[#f0eeea] px-3 py-1.5 text-sm outline-none focus:border-[#1a1a1a] text-[#1a1a1a]"
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="cod_pending">COD Pending</option>
                                                        <option value="paid">Paid</option>
                                                        <option value="failed">Failed</option>
                                                        <option value="processing">Processing</option>
                                                        <option value="shipped">Shipped</option>
                                                        <option value="delivered">Delivered</option>
                                                    </select>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-[#4a4a4a]">{new Date(order.created_at).toLocaleString()}</td>
                                            <td className="px-6 py-4 text-right">
                                                <button onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)} className="text-[#4a4a4a] hover:text-[#1a1a1a]">
                                                    {expandedOrderId === order.id ? <ChevronDown className="w-5 h-5 rotate-180 transition-transform" /> : <ChevronDown className="w-5 h-5 transition-transform" />}
                                                </button>
                                            </td>
                                        </tr>
                                        {expandedOrderId === order.id && (
                                            <tr className="bg-[#FAF9F6]">
                                                <td colSpan={5} className="p-0 border-b border-[#e8e6e1]">
                                                    <div className="p-6 bg-white mx-6 my-4 border border-[#e8e6e1] shadow-sm rounded-[4px] border-l-4 border-l-[#c4a8d4]">
                                                        <h4 className="text-xs font-semibold text-[#8a8a8a] mb-4 uppercase tracking-wider">Order Items</h4>
                                                        <div className="overflow-hidden border border-[#e8e6e1] rounded-[2px]">
                                                            <table className="w-full text-left text-sm max-w-full">
                                                                <thead className="bg-[#f0eeea]">
                                                                    <tr>
                                                                        <th className="px-4 py-3 font-medium text-[#8a8a8a]">Product</th>
                                                                        <th className="px-4 py-3 font-medium text-[#8a8a8a] text-center">Qty</th>
                                                                        <th className="px-4 py-3 font-medium text-[#8a8a8a] text-right">Price</th>
                                                                        <th className="px-4 py-3 font-medium text-[#8a8a8a] text-right">Subtotal</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody className="divide-y divide-[#e8e6e1] bg-white">
                                                                    {order.order_items?.map(item => (
                                                                        <tr key={item.id} className="hover:bg-[#FAF9F6]">
                                                                            <td className="px-4 py-3 flex items-center gap-3">
                                                                                {item.products?.image_url ? (
                                                                                    <img src={item.products.image_url} alt={item.products.name} className="h-10 w-10 object-cover border border-[#e8e6e1]" />
                                                                                ) : (
                                                                                    <div className="h-10 w-10 bg-[#f0eeea] border border-[#e8e6e1] flex items-center justify-center"><PackageIcon className="w-4 h-4 text-[#8a8a8a]" /></div>
                                                                                )}
                                                                                <span className="font-medium text-[#1a1a1a] truncate max-w-[200px]">{item.products?.name}</span>
                                                                            </td>
                                                                            <td className="px-4 py-3 text-center text-[#4a4a4a]">{item.quantity}</td>
                                                                            <td className="px-4 py-3 text-right text-[#4a4a4a]">${Number(item.price).toFixed(2)}</td>
                                                                            <td className="px-4 py-3 text-right font-medium text-[#1a1a1a]">${(Number(item.price) * item.quantity).toFixed(2)}</td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    const renderProducts = () => {
        return (
            <div className="space-y-8 animate-in fade-in duration-500">
                <div className="bg-white rounded-[4px] border border-[#e8e6e1] shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-[#e8e6e1] bg-[#FAF9F6]">
                        <h3 className="font-serif text-xl tracking-wide text-[#1a1a1a]">Add New Product</h3>
                    </div>
                    <form onSubmit={handleAddProduct} className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[#1a1a1a]">Name *</label>
                                <input required value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full bg-[#f0eeea] border border-[#e8e6e1] px-4 py-2 rounded-[2px] focus:outline-none focus:border-[#1a1a1a] text-[#1a1a1a]" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[#1a1a1a]">Price *</label>
                                <input type="number" step="0.01" required value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="w-full bg-[#f0eeea] border border-[#e8e6e1] px-4 py-2 rounded-[2px] focus:outline-none focus:border-[#1a1a1a] text-[#1a1a1a]" />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-sm font-medium text-[#1a1a1a]">Description</label>
                                <textarea rows={2} value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="w-full bg-[#f0eeea] border border-[#e8e6e1] px-4 py-2 rounded-[2px] focus:outline-none focus:border-[#1a1a1a] text-[#1a1a1a] resize-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[#1a1a1a]">Stock *</label>
                                <input type="number" required value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} className="w-full bg-[#f0eeea] border border-[#e8e6e1] px-4 py-2 rounded-[2px] focus:outline-none focus:border-[#1a1a1a] text-[#1a1a1a]" />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-sm font-medium text-[#1a1a1a]">Image Upload (File or URL)</label>
                                <div className="flex items-center gap-4 flex-wrap">
                                    {imagePreviews.map((preview, idx) => (
                                        <div key={idx} className="relative w-24 h-24 border border-[#e8e6e1] rounded-[2px] overflow-hidden flex-shrink-0">
                                            <img src={preview} className="w-full h-full object-cover" />
                                            <button type="button" onClick={() => removeNewImage(idx)} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition-colors"><X className="w-3 h-3" /></button>
                                        </div>
                                    ))}
                                    {imagePreviews.length === 0 && (
                                        <div className="w-24 h-24 bg-[#f0eeea] border border-[#e8e6e1] border-dashed flex items-center justify-center rounded-[2px] flex-shrink-0">
                                            <Upload className="w-6 h-6 text-[#8a8a8a]" />
                                        </div>
                                    )}
                                    <div className="flex-1 space-y-2 min-w-[200px]">
                                        <input type="file" multiple accept="image/*" onChange={handleImageChange} className="block w-full text-sm text-[#4a4a4a] file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded-[2px] file:bg-[#e8e6e1] file:text-[#1a1a1a] hover:file:bg-[#d4d2cc] cursor-pointer" />
                                        <input type="url" placeholder="Or provide Image URL..." disabled={imageFiles.length > 0} value={newProduct.image_url} onChange={e => setNewProduct({...newProduct, image_url: e.target.value})} className="w-full bg-[#f0eeea] border border-[#e8e6e1] px-4 py-2 rounded-[2px] focus:outline-none focus:border-[#1a1a1a] text-[#1a1a1a] text-sm" />
                                    </div>
                                </div>
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-sm font-medium text-[#1a1a1a]">Status *</label>
                                <select value={newProduct.status} onChange={e => setNewProduct({...newProduct, status: e.target.value})} className="w-full bg-[#f0eeea] border border-[#e8e6e1] px-4 py-2 rounded-[2px] focus:outline-none focus:border-[#1a1a1a] text-[#1a1a1a]">
                                    <option value="available">Available</option>
                                    <option value="coming_soon">Coming Soon</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end pt-4 border-t border-[#e8e6e1]">
                            <button disabled={isSubmitting} className="px-6 py-2.5 bg-[#1a1a1a] text-white rounded-[2px] hover:bg-[#333] transition-colors font-medium">
                                {isSubmitting ? 'Adding...' : 'Add Product'}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="bg-white rounded-[4px] border border-[#e8e6e1] shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-[#e8e6e1] bg-[#FAF9F6]">
                        <h3 className="font-serif text-xl tracking-wide text-[#1a1a1a]">Product Management</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-[#f0eeea] text-[#8a8a8a]">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Product</th>
                                    <th className="px-6 py-4 font-medium">Price</th>
                                    <th className="px-6 py-4 font-medium">Stock</th>
                                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#e8e6e1]">
                                {products.map(product => (
                                    <tr key={product.id} className="hover:bg-[#f0eeea]/50 transition-colors">
                                        <td className="px-6 py-4 flex gap-4 items-center">
                                            {product.images && product.images.length > 0 ? (
                                                <img src={product.images[0]} alt={product.name} className="h-12 w-12 object-cover border border-[#e8e6e1] bg-[#f0eeea] rounded-[2px]" />
                                            ) : product.image_url ? (
                                                <img src={product.image_url} alt={product.name} className="h-12 w-12 object-cover border border-[#e8e6e1] bg-[#f0eeea] rounded-[2px]" />
                                            ) : (
                                                <div className="h-12 w-12 bg-[#f0eeea] border border-[#e8e6e1] flex justify-center items-center"><PackageIcon className="w-5 h-5 text-[#8a8a8a]" /></div>
                                            )}
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-[#1a1a1a]">{product.name}</span>
                                                    {product.status === 'coming_soon' && <span className="px-1.5 py-0.5 text-[9px] font-bold bg-[#1a1a1a] text-white rounded-[2px] tracking-widest uppercase">Coming Soon</span>}
                                                </div>
                                                <span className="text-xs text-[#8a8a8a] max-w-[200px] truncate">{product.description || 'No description'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">₹{(typeof product.price === 'number' ? product.price : Number(product.price)).toFixed(2)}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-[11px] uppercase tracking-wider rounded-[2px] ${product.stock > 10 ? 'bg-green-100 text-green-800' : product.stock > 0 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}`}>
                                                {product.stock}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => handleEditClick(product)} className="p-1.5 text-[#4a4a4a] hover:bg-[#e8e6e1] hover:text-[#1a1a1a] transition-colors rounded-[2px]"><Edit2 className="w-4 h-4" /></button>
                                                <button onClick={() => handleDeleteProduct(product.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-[2px] transition-colors"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    const renderEditModal = () => {
        if (!editingProductId) return null;
        return (
            <div className="fixed inset-0 bg-[#1a1a1a]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-[4px] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-[#e8e6e1]">
                    <div className="p-6 border-b border-[#e8e6e1] bg-[#FAF9F6] sticky top-0 z-10 flex justify-between items-center">
                        <h3 className="font-serif text-xl tracking-wide text-[#1a1a1a]">Edit Product</h3>
                        <button onClick={handleCancelEdit} className="text-[#8a8a8a] hover:text-[#1a1a1a] transition-colors"><X className="w-5 h-5" /></button>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[#1a1a1a]">Name *</label>
                                <input required value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full bg-[#f0eeea] border border-[#e8e6e1] px-4 py-2 rounded-[2px] focus:outline-none focus:border-[#1a1a1a] text-[#1a1a1a]" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[#1a1a1a]">Price *</label>
                                <input type="number" step="0.01" required value={editForm.price} onChange={e => setEditForm({...editForm, price: e.target.value})} className="w-full bg-[#f0eeea] border border-[#e8e6e1] px-4 py-2 rounded-[2px] focus:outline-none focus:border-[#1a1a1a] text-[#1a1a1a]" />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-sm font-medium text-[#1a1a1a]">Description</label>
                                <textarea rows={3} value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} className="w-full bg-[#f0eeea] border border-[#e8e6e1] px-4 py-2 rounded-[2px] focus:outline-none focus:border-[#1a1a1a] text-[#1a1a1a] resize-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[#1a1a1a]">Stock *</label>
                                <input type="number" required value={editForm.stock} onChange={e => setEditForm({...editForm, stock: e.target.value})} className="w-full bg-[#f0eeea] border border-[#e8e6e1] px-4 py-2 rounded-[2px] focus:outline-none focus:border-[#1a1a1a] text-[#1a1a1a]" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[#1a1a1a]">Status *</label>
                                <select value={editForm.status} onChange={e => setEditForm({...editForm, status: e.target.value})} className="w-full bg-[#f0eeea] border border-[#e8e6e1] px-4 py-2 rounded-[2px] focus:outline-none focus:border-[#1a1a1a] text-[#1a1a1a]">
                                    <option value="available">Available</option>
                                    <option value="coming_soon">Coming Soon</option>
                                </select>
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-sm font-medium text-[#1a1a1a]">Images (Supports Multiple)</label>
                                <div className="flex items-center gap-4 flex-wrap mt-2">
                                    {editForm.images.map((imgUrl, idx) => (
                                        <div key={`existing-${idx}`} className="relative w-20 h-20 border border-[#e8e6e1] bg-[#FAF9F6] rounded-[2px] overflow-hidden flex-shrink-0">
                                            <img src={imgUrl} className="w-full h-full object-cover" />
                                            <button type="button" onClick={() => removeExistingEditImage(idx)} className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"><X className="w-3 h-3" /></button>
                                        </div>
                                    ))}
                                    {editImagePreviews.map((preview, idx) => (
                                        <div key={`new-${idx}`} className="relative w-20 h-20 border border-green-300 bg-[#FAF9F6] rounded-[2px] overflow-hidden flex-shrink-0">
                                            <img src={preview} className="w-full h-full object-cover" />
                                            <button type="button" onClick={() => removeEditImage(idx)} className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"><X className="w-3 h-3" /></button>
                                        </div>
                                    ))}
                                    <label className="flex flex-col items-center justify-center w-20 h-20 border border-[#e8e6e1] border-dashed rounded-[2px] cursor-pointer hover:bg-[#FAF9F6] bg-white text-[#8a8a8a] transition-colors flex-shrink-0">
                                        <Upload className="w-5 h-5 mb-1" />
                                        <span className="text-[9px] uppercase tracking-wider font-medium">Add</span>
                                        <input type="file" multiple accept="image/*" onChange={handleEditImageChange} className="hidden" />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 border-t border-[#e8e6e1] bg-[#FAF9F6] flex justify-end gap-3 rounded-b-[4px]">
                        <button onClick={handleCancelEdit} disabled={isSavingEdit} className="px-5 py-2 border border-[#e8e6e1] text-[#4a4a4a] hover:bg-[#e8e6e1] transition-colors rounded-[2px] font-medium">Cancel</button>
                        <button onClick={() => handleSaveEdit(editingProductId)} disabled={isSavingEdit} className="px-5 py-2 bg-[#1a1a1a] text-white hover:bg-[#333] transition-colors rounded-[2px] font-medium">
                            {isSavingEdit ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const renderReviews = () => {
        return (
            <div className="space-y-8 animate-in fade-in duration-500">
                <div className="bg-white rounded-[4px] border border-[#e8e6e1] shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-[#e8e6e1] bg-[#FAF9F6]">
                        <h3 className="font-serif text-xl tracking-wide text-[#1a1a1a]">Review Management</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-[#f0eeea] text-[#8a8a8a]">
                                <tr>
                                    <th className="px-6 py-4 font-medium min-w-[200px]">Product / User</th>
                                    <th className="px-6 py-4 font-medium w-full">Review</th>
                                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#e8e6e1] whitespace-normal">
                                {reviews.map(review => (
                                    <tr key={review.id} className="hover:bg-[#f0eeea]/50 transition-colors">
                                        <td className="px-6 py-4 align-top">
                                            <div className="font-medium text-[#1a1a1a] mb-1">{review.products?.name || 'Unknown Product'}</div>
                                            <div className="text-xs text-[#8a8a8a] truncate max-w-[150px]">User: {review.user_id.slice(0,8)}...</div>
                                            <div className="text-xs text-[#8a8a8a] mt-1">{new Date(review.created_at).toLocaleDateString()}</div>
                                        </td>
                                        <td className="px-6 py-4 align-top">
                                            <div className="flex text-amber-500 mb-2">
                                                {[1,2,3,4,5].map(s => <span key={s}>{s <= review.rating ? '★' : '☆'}</span>)}
                                            </div>
                                            <p className="text-[#4a4a4a] text-sm line-clamp-2">{review.comment || <span className="italic text-[#8a8a8a]">No comment</span>}</p>
                                        </td>
                                        <td className="px-6 py-4 text-right align-top break-normal whitespace-nowrap">
                                             <button onClick={() => handleDeleteReview(review.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-[2px] transition-colors border border-transparent hover:border-red-200"><Trash2 className="w-4 h-4" /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-[#FAF9F6] text-[#1a1a1a] pt-[64px] md:pt-[80px]">
            {/* Sidebar Navigation */}
            <div className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 transition duration-300 ease-in-out z-40 w-64 bg-[#1a1a1a] text-[#FAF9F6] border-r border-[#333] pt-[64px] md:pt-0 flex flex-col shadow-2xl md:shadow-none`}>
                 <div className="p-6 hidden md:block border-b border-[#333]">
                     <h2 className="text-xl font-serif tracking-widest text-[#FAF9F6] opacity-90">ADMIN</h2>
                 </div>
                 <nav className="flex-1 mt-6 px-4 space-y-2">
                     <button onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-[2px] font-medium transition-all ${activeTab === 'dashboard' ? 'bg-[#2d1b3d] text-white border-l-2 border-[#c4a8d4]' : 'text-[#8a8a8a] hover:text-white hover:bg-[#333]'}`}>
                         <LayoutDashboard className="w-4 h-4" /> Dashboard
                     </button>
                     <button onClick={() => { setActiveTab('orders'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-[2px] font-medium transition-all ${activeTab === 'orders' ? 'bg-[#2d1b3d] text-white border-l-2 border-[#c4a8d4]' : 'text-[#8a8a8a] hover:text-white hover:bg-[#333]'}`}>
                         <ShoppingBag className="w-4 h-4" /> Orders
                     </button>
                     <button onClick={() => { setActiveTab('products'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-[2px] font-medium transition-all ${activeTab === 'products' ? 'bg-[#2d1b3d] text-white border-l-2 border-[#c4a8d4]' : 'text-[#8a8a8a] hover:text-white hover:bg-[#333]'}`}>
                         <PackageIcon className="w-4 h-4" /> Products
                     </button>
                     <button onClick={() => { setActiveTab('reviews'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-[2px] font-medium transition-all ${activeTab === 'reviews' ? 'bg-[#2d1b3d] text-white border-l-2 border-[#c4a8d4]' : 'text-[#8a8a8a] hover:text-white hover:bg-[#333]'}`}>
                         <MessageSquare className="w-4 h-4" /> Reviews
                     </button>
                     <button onClick={() => { setActiveTab('hero'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-[2px] font-medium transition-all ${activeTab === 'hero' ? 'bg-[#2d1b3d] text-white border-l-2 border-[#c4a8d4]' : 'text-[#8a8a8a] hover:text-white hover:bg-[#333]'}`}>
                         <LucideImage className="w-4 h-4" /> Hero Slides
                     </button>
                 </nav>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && <div className="fixed inset-0 bg-[#1a1a1a]/50 backdrop-blur-sm z-30 md:hidden" onClick={() => setIsSidebarOpen(false)} />}

            {/* Edit Modal Overlay */}
            {renderEditModal()}

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <header className="bg-white border-b border-[#e8e6e1] px-6 py-4 flex items-center justify-between md:hidden shadow-sm z-20">
                     <h2 className="text-xl font-serif text-[#1a1a1a]">Admin Panel</h2>
                     <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-[#1a1a1a] bg-[#f0eeea] rounded-[2px]"><Menu className="w-5 h-5" /></button>
                </header>

                <main className="flex-1 overflow-y-auto p-6 lg:p-10 bg-[#FAF9F6]">
                    <div className="max-w-[1400px] mx-auto">
                        {activeTab === 'dashboard' && renderDashboard()}
                        {activeTab === 'orders' && renderOrders()}
                        {activeTab === 'products' && renderProducts()}
                        {activeTab === 'reviews' && renderReviews()}
                        {activeTab === 'hero' && <HeroManagement />}
                    </div>
                </main>
            </div>
        </div>
    );
}
