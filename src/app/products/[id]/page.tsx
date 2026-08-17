"use client";

import { useEffect, useState, use } from "react";
import { supabase } from "../../../../lib/supabase";
import { useCart } from "@/components/CartProvider";
import { useAuth } from "../../../components/AuthProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { uploadImageToCloudinary } from "@/components/utils/cloudinaryUpload";
import { Upload, X } from "lucide-react";

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { addToCart } = useCart();
    const { user } = useAuth();
    const router = useRouter();

    const [product, setProduct] = useState<any>(null);
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
    const [isInWishlist, setIsInWishlist] = useState(false);

    // Purchase state
    const [quantity, setQuantity] = useState(1);

    // Review form state
    const [submitReviewData, setSubmitReviewData] = useState({ rating: 5, comment: '', image_url: '' });
    const [submittingReview, setSubmittingReview] = useState(false);
    const [reviewError, setReviewError] = useState<string | null>(null);
    const [showReviewForm, setShowReviewForm] = useState(false);

    // Purchase & Image State
    const [hasPurchased, setHasPurchased] = useState(false);
    const [reviewImageFile, setReviewImageFile] = useState<File | null>(null);
    const [reviewImagePreview, setReviewImagePreview] = useState<string | null>(null);

    useEffect(() => {
        async function fetchProductAndReviews() {
            setLoading(true);

            const { data: productData, error: productError } = await supabase
                .from("products")
                .select("*")
                .eq("id", id)
                .single();

            if (productError || !productData) {
                setError(true);
                setLoading(false);
                return;
            }

            setProduct(productData);

            const { data: reviewsData, error: reviewsError } = await supabase
                .from("reviews")
                .select(`
                    id, rating, comment, image_url, created_at, user_id,
                    profiles:user_id (id)
                `)
                .eq("product_id", id)
                .order("created_at", { ascending: false });

            if (!reviewsError && reviewsData) {
                setReviews(reviewsData);
            }

            // Fetch Related Products — only available (stock > 0)
            let related: any[] = [];
            if (productData.category) {
                const { data: relatedData } = await supabase
                    .from("products")
                    .select("*")
                    .eq("category", productData.category)
                    .neq("id", id)
                    .gt("stock", 0)
                    .limit(8);

                if (relatedData && relatedData.length > 0) {
                    related = relatedData;
                }
            }

            // If no same-category suggestions, fetch other available products
            if (related.length === 0) {
                const { data: fallbackData } = await supabase
                    .from("products")
                    .select("*")
                    .neq("id", id)
                    .gt("stock", 0)
                    .limit(8);

                if (fallbackData && fallbackData.length > 0) {
                    related = fallbackData;
                }
            }

            setRelatedProducts(related);

            if (user) {
                const { data: wishlistData } = await supabase
                    .from("wishlist")
                    .select("id")
                    .eq("product_id", id)
                    .eq("user_id", user.id)
                    .single();

                if (wishlistData) setIsInWishlist(true);

                const { data: confirmedPurchase } = await supabase
                    .from("order_items")
                    .select("id, orders!inner(user_id, status)")
                    .eq("product_id", id)
                    .eq("orders.user_id", user.id)
                    .limit(1);

                if (confirmedPurchase && confirmedPurchase.length > 0) {
                    setHasPurchased(true);
                }
            }

            setLoading(false);
        }

        fetchProductAndReviews();
    }, [id]);

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
        toast.success(`${quantity}× ${product.name} added to cart`);
    };

    const handleQuantityChange = (change: number) => {
        const newQuantity = quantity + change;
        if (newQuantity >= 1 && newQuantity <= product.stock) {
            setQuantity(newQuantity);
        }
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            router.push("/login");
            return;
        }

        setSubmittingReview(true);
        setReviewError(null);

        try {
            let finalImageUrl = null;
            if (reviewImageFile) {
                finalImageUrl = await uploadImageToCloudinary(reviewImageFile);
            }

            const { data, error } = await supabase
                .from('reviews')
                .insert([{
                    product_id: id,
                    user_id: user.id,
                    rating: submitReviewData.rating,
                    comment: submitReviewData.comment,
                    image_url: finalImageUrl
                }])
                .select();

            if (error) throw error;

            if (data && data.length > 0) {
                setReviews([data[0], ...reviews]);
                setSubmitReviewData({ rating: 5, comment: '', image_url: '' });
                setReviewImageFile(null);
                setReviewImagePreview(null);
                setShowReviewForm(false);
                toast.success("Review submitted! Thank you.");
            }
        } catch (err: any) {
            console.error("Error submitting review:", err);
            setReviewError(err.message || "Failed to submit review.");
        } finally {
            setSubmittingReview(false);
        }
    };

    const handleReviewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setReviewImageFile(file);
            setReviewImagePreview(URL.createObjectURL(file));
        }
    };

    const handleToggleWishlist = async () => {
        if (!user) {
            router.push("/login");
            return;
        }

        if (isInWishlist) {
            const { error } = await supabase
                .from("wishlist")
                .delete()
                .eq("product_id", id)
                .eq("user_id", user.id);

            if (!error) {
                setIsInWishlist(false);
                toast.success("Removed from wishlist");
            }
        } else {
            const { error } = await supabase
                .from("wishlist")
                .insert([{ product_id: id, user_id: user.id }]);

            if (!error) {
                setIsInWishlist(true);
                toast.success("Added to wishlist");
            }
        }
    };

    /* ─── Loading State ─── */
    if (loading) {
        return (
            <main className="min-h-screen bg-[#FAF9F6] px-4 py-16 flex justify-center items-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-8 w-8 bg-[#e8e6e1] rounded-full mb-4"></div>
                    <p className="text-[#8a8a8a] font-light">Loading details...</p>
                </div>
            </main>
        );
    }

    /* ─── Error State ─── */
    if (error || !product) {
        return (
            <main className="min-h-screen bg-[#FAF9F6] px-4 py-24 flex flex-col items-center justify-center">
                <div className="text-center max-w-md">
                    <svg className="mx-auto h-12 w-12 text-[#8a8a8a] mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h1 className="text-2xl font-serif font-light text-[#1a1a1a] tracking-tight mb-2">Product Not Found</h1>
                    <p className="text-[#4a4a4a] font-light mb-8">The product you&apos;re looking for doesn&apos;t exist or has been removed from our catalog.</p>
                    <button onClick={() => router.push('/')} className="inline-flex items-center justify-center bg-[#1a1a1a] px-8 py-4 text-sm font-medium text-white hover:bg-[#333] transition-colors rounded-[2px] tracking-wide">
                        Return to Store
                    </button>
                </div>
            </main>
        );
    }

    const galleryImages = [product.image_url, ...reviews.map(r => r.image_url).filter(Boolean)].filter(Boolean);

    return (
        <main className="min-h-screen bg-[#FAF9F6]">
            <div className="container mx-auto px-4 py-12 max-w-7xl">
                {/* Breadcrumb */}
                <div className="mb-8">
                    <button onClick={() => router.back()} className="inline-flex items-center text-sm font-light text-[#8a8a8a] hover:text-[#1a1a1a] transition-colors">
                        <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to browsing
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-20">

                    {/* Left: Image */}
                    <div className="flex flex-col gap-4">
                        <div className="w-full aspect-[4/5] sm:aspect-square lg:aspect-[4/5] bg-[#f0eeea] rounded-[2px] overflow-hidden relative border border-[#e8e6e1]">
                            {product.image_url ? (
                                <img
                                    src={product.image_url}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-[#8a8a8a]">
                                    <svg className="w-12 h-12 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            )}

                            {product.stock === 0 && (
                                <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md text-[#1a1a1a] text-xs font-semibold px-4 py-2 uppercase tracking-widest">
                                    Sold Out
                                </div>
                            )}
                        </div>

                        {/* Mini Gallery */}
                        {galleryImages.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-2">
                                {galleryImages.slice(0, 5).map((img, i) => (
                                    <div key={i} className="w-20 h-24 sm:w-24 sm:h-28 flex-shrink-0 rounded-[2px] overflow-hidden bg-[#f0eeea] border border-[#e8e6e1] cursor-pointer hover:opacity-80 transition-opacity">
                                        <img src={img} className="w-full h-full object-cover" alt="Gallery" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Product Info */}
                    <div className="flex flex-col pt-4 lg:pt-10">
                        {product.category && (
                            <p className="text-xs font-semibold uppercase tracking-widest text-[#8a8a8a] mb-3">{product.category}</p>
                        )}
                        <h1 className="text-4xl sm:text-5xl font-serif font-light text-[#1a1a1a] mb-4 tracking-tight leading-tight">{product.name}</h1>
                        <p className="text-2xl text-[#1a1a1a] font-medium mb-8 font-sans">₹{Number(product.price).toFixed(2)}</p>

                        <div className="mb-10 text-[#4a4a4a] font-light leading-relaxed text-base">
                            <p className="whitespace-pre-line">{product.description || "A captivating fragrance designed for the modern individual."}</p>
                        </div>

                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-4">
                                <span className={`inline-flex items-center px-3 py-1 text-xs font-medium tracking-wide
                                    ${product.stock > 10
                                        ? 'bg-green-50 text-green-700 border border-green-200'
                                        : product.stock > 0
                                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                            : 'bg-red-50 text-red-700 border border-red-200'
                                    }`}>
                                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                </span>
                            </div>

                            {/* Quantity Selector */}
                            <div className="flex items-center gap-6 mt-6 pb-8 border-b border-[#e8e6e1]">
                                <span className="text-sm font-medium text-[#1a1a1a]">Quantity</span>
                                <div className="flex items-center border border-[#e8e6e1] bg-white">
                                    <button
                                        onClick={() => handleQuantityChange(-1)}
                                        disabled={quantity <= 1 || product.stock === 0}
                                        className="w-10 h-10 flex items-center justify-center text-[#4a4a4a] hover:text-[#1a1a1a] disabled:opacity-30 transition-colors"
                                    >
                                        &minus;
                                    </button>
                                    <span className="w-12 text-center text-sm font-medium text-[#1a1a1a] select-none">{product.stock > 0 ? quantity : 0}</span>
                                    <button
                                        onClick={() => handleQuantityChange(1)}
                                        disabled={quantity >= product.stock || product.stock === 0}
                                        className="w-10 h-10 flex items-center justify-center text-[#4a4a4a] hover:text-[#1a1a1a] disabled:opacity-30 transition-colors"
                                    >
                                        &#43;
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock <= 0}
                                className={`flex-1 py-4 px-8 font-medium text-sm tracking-wide transition-all rounded-[2px] ${product.stock > 0
                                    ? 'bg-[#1a1a1a] text-white hover:bg-[#333]'
                                    : 'bg-[#e8e6e1] text-[#8a8a8a] cursor-not-allowed'
                                    }`}
                            >
                                {product.stock > 0 ? `Add to Cart — ₹${(product.price * quantity).toFixed(2)}` : 'Out of Stock'}
                            </button>

                            <button
                                onClick={handleToggleWishlist}
                                className={`p-4 border transition-all rounded-[2px] ${isInWishlist
                                    ? 'bg-[#f0eeea] border-[#e8e6e1] text-[#1a1a1a]'
                                    : 'bg-white border-[#e8e6e1] text-[#8a8a8a] hover:text-[#1a1a1a]'
                                    }`}
                                aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                            >
                                <svg
                                    className={`w-5 h-5 ${isInWishlist ? 'fill-[#1a1a1a] stroke-[#1a1a1a]' : 'fill-none stroke-current'}`}
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* ─── Reviews Section ─── */}
                <div className="border-t border-[#e8e6e1] pt-16 mt-16 pb-24">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div>
                            <h2 className="text-3xl font-serif font-light text-[#1a1a1a] tracking-tight">Customer Reviews</h2>
                            <div className="flex items-center gap-3 mt-3">
                                <div className="flex items-center">
                                    {[1, 2, 3, 4, 5].map(star => {
                                        const avgRating = reviews.length > 0 ? reviews.reduce((a, b) => a + b.rating, 0) / reviews.length : 0;
                                        return (
                                            <svg key={star} className={`w-5 h-5 ${star <= Math.round(avgRating) ? 'text-[#1a1a1a]' : 'text-[#e8e6e1]'}`} fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        );
                                    })}
                                </div>
                                <p className="text-[#8a8a8a] text-sm font-light">
                                    {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
                                </p>
                            </div>
                        </div>

                        {hasPurchased ? (
                            <button
                                onClick={() => setShowReviewForm(!showReviewForm)}
                                className="inline-flex items-center justify-center border border-[#1a1a1a] bg-transparent px-6 py-3 text-sm font-medium text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white transition-colors rounded-[2px] tracking-wide"
                            >
                                {showReviewForm ? 'Cancel Review' : 'Write a Review'}
                            </button>
                        ) : (
                            <div className="text-sm text-[#8a8a8a] font-light italic">Only verified buyers can leave a review.</div>
                        )}
                    </div>

                    {showReviewForm && user && (
                        <div className="bg-[#f0eeea] border border-[#e8e6e1] rounded-[4px] p-6 sm:p-8 mb-12">
                            <h3 className="text-xl font-serif text-[#1a1a1a] mb-6">Write your review</h3>

                            {reviewError && (
                                <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-[4px] border border-red-100">
                                    {reviewError}
                                </div>
                            )}

                            <form onSubmit={handleSubmitReview} className="space-y-6 max-w-2xl">
                                <div>
                                    <label className="block text-sm font-medium text-[#4a4a4a] mb-2">Rating</label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <button
                                                key={star} type="button"
                                                onClick={() => setSubmitReviewData({ ...submitReviewData, rating: star })}
                                                className="focus:outline-none"
                                            >
                                                <svg className={`w-8 h-8 transition-colors ${star <= submitReviewData.rating ? 'text-amber-400' : 'text-[#e8e6e1] hover:text-amber-200'}`} fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="comment" className="block text-sm font-medium text-[#4a4a4a] mb-2">Your Experience</label>
                                    <textarea
                                        id="comment" required rows={4}
                                        value={submitReviewData.comment}
                                        onChange={(e) => setSubmitReviewData({ ...submitReviewData, comment: e.target.value })}
                                        className="block w-full border border-[#e8e6e1] bg-[#FAF9F6] px-4 py-3 text-[#1a1a1a] focus:ring-1 focus:ring-[#1a1a1a] focus:border-[#1a1a1a] focus:outline-none text-sm resize-none rounded-[2px] transition-shadow font-sans placeholder:text-[#c4c0bb]"
                                        placeholder="Tell us what you loved about this fragrance..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#4a4a4a] mb-2">Photo (Optional)</label>
                                    <div className="flex items-center gap-4">
                                        {reviewImagePreview ? (
                                            <div className="relative w-24 h-24 border border-[#e8e6e1] rounded-[2px] overflow-hidden">
                                                <img src={reviewImagePreview} className="w-full h-full object-cover" />
                                                <button type="button" onClick={() => { setReviewImageFile(null); setReviewImagePreview(null); }} className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"><X className="w-3 h-3" /></button>
                                            </div>
                                        ) : (
                                            <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-[#e8e6e1] rounded-[2px] cursor-pointer hover:bg-[#f0eeea] transition-colors">
                                                <Upload className="w-6 h-6 text-[#8a8a8a] mb-1" />
                                                <span className="text-[10px] text-[#8a8a8a] font-medium">Upload Image</span>
                                                <input type="file" accept="image/*" onChange={handleReviewImageChange} className="hidden" />
                                            </label>
                                        )}
                                    </div>
                                    <p className="mt-2 text-xs text-[#8a8a8a] font-light">Add a photo of your product to show others!</p>
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        type="button" onClick={() => setShowReviewForm(false)}
                                        className="px-5 py-3 text-sm font-medium text-[#4a4a4a] hover:text-[#1a1a1a] transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit" disabled={submittingReview}
                                        className="inline-flex items-center justify-center bg-[#1a1a1a] px-6 py-3 text-sm font-medium text-white hover:bg-[#333] disabled:opacity-50 transition-colors rounded-[2px] tracking-wide"
                                    >
                                        {submittingReview ? 'Submitting...' : 'Submit Review'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {reviews.length === 0 ? (
                        <div className="py-16 text-center bg-[#f0eeea] rounded-[4px] border border-dashed border-[#e8e6e1]">
                            <p className="text-[#8a8a8a] font-light italic">No reviews yet. Be the first to share your experience!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {reviews.map((review) => (
                                <div key={review.id} className="bg-white p-6 sm:p-8 rounded-[4px] border border-[#e8e6e1] flex flex-col">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <svg key={star} className={`w-4 h-4 ${star <= review.rating ? 'text-[#1a1a1a]' : 'text-[#e8e6e1]'}`} fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                        </div>
                                        <span className="text-xs text-[#8a8a8a] font-light">
                                            {new Date(review.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-[#4a4a4a] leading-relaxed text-sm flex-1 whitespace-pre-line mb-6 font-light">
                                        &ldquo;{review.comment}&rdquo;
                                    </p>

                                    {review.image_url && (
                                        <div className="w-full h-32 rounded-[2px] overflow-hidden bg-[#f0eeea] mt-auto border border-[#e8e6e1]">
                                            <img src={review.image_url} alt="Review attachment" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ─── Related / Suggested Products ─── */}
                {relatedProducts.length > 0 && (
                    <div className="border-t border-[#e8e6e1] pt-16 mt-8 pb-16">
                        <h2 className="text-3xl font-serif font-light text-[#1a1a1a] tracking-tight mb-12">You Might Also Like</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                            {relatedProducts.map((relProduct) => (
                                <Link href={`/products/${relProduct.id}`} key={relProduct.id} className="group flex flex-col">
                                    <div className="relative w-full aspect-[3/4] rounded-[2px] overflow-hidden bg-[#f0eeea] mb-4 border border-[#e8e6e1]">
                                        {relProduct.image_url ? (
                                            <img
                                                src={relProduct.image_url}
                                                alt={relProduct.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-[#8a8a8a]">
                                                <span className="font-sans text-sm">No Image</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col text-left">
                                        <h3 className="font-sans text-[#1a1a1a] text-base font-medium mb-1 group-hover:underline decoration-1 underline-offset-4 transition-colors">
                                            {relProduct.name}
                                        </h3>
                                        <p className="font-sans text-sm text-[#1a1a1a]">₹{Number(relProduct.price).toFixed(2)}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </main>
    );
}
