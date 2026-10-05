"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";
import { useCart } from "@/components/CartProvider";
import { useAuth } from "../../../components/AuthProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { uploadImageToCloudinary } from "@/components/utils/cloudinaryUpload";
import { Upload, X } from "lucide-react";

interface ProductDetailClientProps {
    id: string;
}

export default function ProductDetailClient({ id }: ProductDetailClientProps) {
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
    }, [id, user]);

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
        } catch (err: unknown) {
            console.error("Error submitting review:", err);
            setReviewError(err instanceof Error ? err.message : "Failed to submit review.");
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
    }

    /* ─── Loading State ─── */
    if (loading) {
        return (
            <main className="min-h-screen bg-[#F7F4EE] text-[#282421] px-4 py-24 flex justify-center items-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-10 w-10 border-2 border-[#5B3C58] border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-[#817B73] font-light text-sm tracking-wider uppercase">Loading olfactory details...</p>
                </div>
            </main>
        );
    }

    /* ─── Error State ─── */
    if (error || !product) {
        return (
            <main className="min-h-screen bg-[#F7F4EE] text-[#282421] px-4 py-28 flex flex-col items-center justify-center">
                <div className="text-center max-w-md glass-card p-10 rounded-2xl">
                    <h1 className="text-2xl font-serif text-[#282421] mb-3">Fragrance Not Found</h1>
                    <p className="text-[#817B73] font-light mb-8 text-sm">The fragrance you&apos;re looking for doesn&apos;t exist or has been removed from our anthology.</p>
                    <button onClick={() => router.push('/')} className="inline-flex items-center justify-center bg-[#5B3C58] text-[#F7F4EE] px-8 py-3.5 text-xs font-semibold uppercase tracking-widest hover:bg-[#5B3C58] transition-colors rounded-full aura-glow">
                        Return to Boutique
                    </button>
                </div>
            </main>
        );
    }

    const galleryImages = [product.image_url, ...reviews.map(r => r.image_url).filter(Boolean)].filter(Boolean);

    return (
        <main className="min-h-screen bg-[#F7F4EE] text-[#282421] pt-8 pb-28">
            <div className="container mx-auto px-6 max-w-7xl">
                {/* Breadcrumb */}
                <div className="mb-8">
                    <button onClick={() => router.back()} className="inline-flex items-center text-xs uppercase tracking-widest text-[#817B73]/80 hover:text-[#5B3C58] transition-colors">
                        <svg className="mr-2 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Anthology
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-20">
                    {/* Left: Image Container */}
                    <div className="flex flex-col gap-4">
                        <div className="w-full aspect-[4/5] glass-card rounded-2xl overflow-hidden relative flex items-center justify-center p-8">
                            {product.image_url ? (
                                <img
                                    src={product.image_url}
                                    alt={product.name}
                                    className="w-full h-full object-contain mix-blend-screen drop-shadow-2xl"
                                />
                            ) : (
                                <div className="text-[#817B73]/40 font-serif italic">
                                    WearAura Flacon
                                </div>
                            )}

                            {product.stock === 0 && (
                                <div className="absolute top-6 right-6 bg-[#F7F4EE]/90 border border-[#C53030]/40 text-[#C53030] text-[10px] font-semibold px-4 py-1.5 uppercase tracking-widest rounded-full">
                                    Sold Out
                                </div>
                            )}
                        </div>

                        {/* Mini Gallery */}
                        {galleryImages.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-2">
                                {galleryImages.slice(0, 5).map((img, i) => (
                                    <div key={i} className="w-20 h-24 flex-shrink-0 rounded-xl overflow-hidden glass-card p-2 cursor-pointer hover:border-[#5B3C58] transition-colors">
                                        <img src={img} className="w-full h-full object-contain mix-blend-screen" alt="Gallery" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Product Info */}
                    <div className="flex flex-col justify-center">
                        {product.category && (
                            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#5B3C58] mb-3 font-mono">
                                {product.category}
                            </span>
                        )}
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#282421] mb-4 leading-tight">
                            {product.name}
                        </h1>
                        <p className="text-2xl text-[#5B3C58] font-semibold mb-6 font-sans">
                            ₹{Number(product.price).toFixed(2)}
                        </p>

                        <div className="mb-8 text-[#817B73] font-light leading-relaxed text-sm sm:text-base border-y border-[#282421]/15 py-6">
                            <p className="whitespace-pre-line">{product.description || "A captivating extrait de parfum designed for the discerning individual."}</p>
                        </div>

                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-4">
                                <span className={`inline-flex items-center px-3 py-1 text-xs font-medium tracking-wide rounded-full border
                                    ${product.stock > 10
                                        ? 'bg-[#003731]/30 text-[#3cddc7] border-[#3cddc7]/30'
                                        : product.stock > 0
                                            ? 'bg-[#F7F4EE]/30 text-[#5B3C58] border-[#5B3C58]/30'
                                            : 'bg-[#FFF5F5]/30 text-[#C53030] border-[#C53030]/30'
                                    }`}>
                                    {product.stock > 0 ? `${product.stock} available in batch` : 'Currently out of stock'}
                                </span>
                            </div>

                            {/* Quantity Selector */}
                            <div className="flex items-center gap-6 mt-6 pb-6">
                                <span className="text-xs uppercase tracking-widest text-[#817B73]">Quantity</span>
                                <div className="flex items-center border border-[#282421]/20 bg-[#F0ECE4] rounded-full overflow-hidden">
                                    <button
                                        onClick={() => handleQuantityChange(-1)}
                                        disabled={quantity <= 1 || product.stock === 0}
                                        className="w-9 h-9 flex items-center justify-center text-[#817B73] hover:text-[#5B3C58] disabled:opacity-30 transition-colors"
                                    >
                                        &minus;
                                    </button>
                                    <span className="w-10 text-center text-xs font-medium text-[#282421] select-none">{product.stock > 0 ? quantity : 0}</span>
                                    <button
                                        onClick={() => handleQuantityChange(1)}
                                        disabled={quantity >= product.stock || product.stock === 0}
                                        className="w-9 h-9 flex items-center justify-center text-[#817B73] hover:text-[#5B3C58] disabled:opacity-30 transition-colors"
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
                                className={`flex-1 py-4 px-8 font-semibold text-xs uppercase tracking-widest transition-all rounded-full aura-glow ${product.stock > 0
                                    ? 'bg-[#5B3C58] text-[#F7F4EE] hover:bg-[#5B3C58]'
                                    : 'bg-[#E5DFD7] text-[#817B73] cursor-not-allowed'
                                    }`}
                            >
                                {product.stock > 0 ? `Add to Cart — ₹${(product.price * quantity).toFixed(2)}` : 'Out of Stock'}
                            </button>

                            <button
                                onClick={handleToggleWishlist}
                                className={`p-4 border transition-all rounded-full ${isInWishlist
                                    ? 'bg-[#E5DFD7] border-[#5B3C58] text-[#5B3C58]'
                                    : 'glass-card border-[#282421]/20 text-[#817B73] hover:text-[#5B3C58] hover:border-[#5B3C58]'
                                    }`}
                                aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                            >
                                <svg
                                    className={`w-5 h-5 ${isInWishlist ? 'fill-[#5B3C58] stroke-[#5B3C58]' : 'fill-none stroke-current'}`}
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* ─── Reviews Section ─── */}
                <div className="border-t border-[#282421]/15 pt-16 mt-16 pb-20">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div>
                            <span className="text-xs uppercase tracking-widest text-[#5B3C58] block mb-2">Verified Sillage</span>
                            <h2 className="text-3xl font-serif text-[#282421]">Client Impressions</h2>
                            <div className="flex items-center gap-3 mt-3">
                                <div className="flex items-center text-[#5B3C58]">
                                    {[1, 2, 3, 4, 5].map(star => {
                                        const avgRating = reviews.length > 0 ? reviews.reduce((a, b) => a + b.rating, 0) / reviews.length : 0;
                                        return (
                                            <svg key={star} className={`w-4 h-4 ${star <= Math.round(avgRating) ? 'fill-[#5B3C58] text-[#5B3C58]' : 'text-[#817B73]/30'}`} fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        );
                                    })}
                                </div>
                                <p className="text-[#817B73] text-xs font-light">
                                    {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
                                </p>
                            </div>
                        </div>

                        {hasPurchased ? (
                            <button
                                onClick={() => setShowReviewForm(!showReviewForm)}
                                className="inline-flex items-center justify-center border border-[#5B3C58] bg-transparent px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-[#5B3C58] hover:bg-[#5B3C58]/10 transition-colors rounded-full"
                            >
                                {showReviewForm ? 'Cancel Review' : 'Write a Review'}
                            </button>
                        ) : (
                            <div className="text-xs text-[#817B73]/60 font-light italic">Verified clients can submit fragrance reviews.</div>
                        )}
                    </div>

                    {showReviewForm && user && (
                        <div className="glass-card rounded-2xl p-6 sm:p-8 mb-12 max-w-2xl">
                            <h3 className="text-xl font-serif text-[#282421] mb-6">Your Impression</h3>

                            {reviewError && (
                                <div className="mb-6 p-4 bg-[#FFF5F5]/40 text-[#C53030] text-xs rounded-lg border border-[#C53030]/30">
                                    {reviewError}
                                </div>
                            )}

                            <form onSubmit={handleSubmitReview} className="space-y-6">
                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-[#817B73] mb-2">Rating</label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <button
                                                key={star} type="button"
                                                onClick={() => setSubmitReviewData({ ...submitReviewData, rating: star })}
                                                className="focus:outline-none"
                                            >
                                                <svg className={`w-6 h-6 transition-colors ${star <= submitReviewData.rating ? 'text-[#5B3C58] fill-[#5B3C58]' : 'text-[#817B73]/30 hover:text-[#5B3C58]'}`} fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-[#817B73] mb-2">Your Review</label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={submitReviewData.comment}
                                        onChange={(e) => setSubmitReviewData({ ...submitReviewData, comment: e.target.value })}
                                        placeholder="Describe the notes, projection, and wear on your skin..."
                                        className="form-input text-sm resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={submittingReview}
                                    className="bg-[#5B3C58] text-[#F7F4EE] hover:bg-[#5B3C58] px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-widest transition-all aura-glow disabled:opacity-50"
                                >
                                    {submittingReview ? 'Submitting...' : 'Post Review'}
                                </button>
                            </form>
                        </div>
                    )}

                    {reviews.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {reviews.map((rev) => (
                                <div key={rev.id} className="glass-card p-6 rounded-2xl space-y-3">
                                    <div className="flex items-center text-[#5B3C58]">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <svg key={s} className={`w-3.5 h-3.5 ${s <= rev.rating ? 'fill-[#5B3C58] text-[#5B3C58]' : 'text-[#817B73]/30'}`} fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <p className="text-sm text-[#282421] font-light leading-relaxed">&ldquo;{rev.comment}&rdquo;</p>
                                    <p className="text-[10px] text-[#817B73] uppercase tracking-wider">{new Date(rev.created_at).toLocaleDateString()}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-[#817B73]/60 font-light italic">Be the first to share your olfactory impression.</p>
                    )}
                </div>

                {/* ─── Related Fragrances ─── */}
                {relatedProducts.length > 0 && (
                    <div className="border-t border-[#282421]/15 pt-16">
                        <div className="text-center mb-12 space-y-2">
                            <span className="text-xs uppercase tracking-widest text-[#5B3C58]">Complementary Notes</span>
                            <h2 className="text-3xl font-serif text-[#282421]">You May Also Appreciate</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.slice(0, 4).map((rel) => (
                                <div
                                    key={rel.id}
                                    onClick={() => router.push(`/products/${rel.id}`)}
                                    className="glass-card p-6 rounded-2xl flex flex-col justify-between group cursor-pointer hover:-translate-y-1 transition-all"
                                >
                                    <div className="h-44 flex items-center justify-center mb-4">
                                        {rel.image_url ? (
                                            <img src={rel.image_url} alt={rel.name} className="w-full h-full object-contain mix-blend-screen opacity-80 group-hover:opacity-100 transition-opacity" />
                                        ) : (
                                            <div className="text-[#817B73]/40 font-serif italic text-xs">WearAura Flacon</div>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="text-base font-serif text-[#282421] truncate group-hover:text-[#5B3C58] transition-colors">{rel.name}</h4>
                                        <p className="text-sm font-semibold text-[#5B3C58] mt-1">₹{Number(rel.price).toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </main>
    );
}
