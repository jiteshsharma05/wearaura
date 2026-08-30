"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import Link from "next/link";
import { useAuth } from "../components/AuthProvider";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Shield, Sparkles, ArrowUpRight, ChevronRight, ChevronLeft, Heart, Compass } from "lucide-react";

interface HeroImage {
  id: string;
  image_url: string;
  title: string | null;
  subtitle: string | null;
  button_text: string | null;
  button_link: string | null;
  sort_order: number;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string | null;
  stock: number;
  image_url: string | null;
  images?: string[];
  status: string;
}

export default function Home() {
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const { user } = useAuth();
  const router = useRouter();

  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play Carousel (slow luxury pace)
  useEffect(() => {
    if (heroImages.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 12000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  useEffect(() => {
    const fetchHeroImages = async () => {
      const { data, error } = await supabase
        .from("hero_images")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
        
      if (!error && data && data.length > 0) {
        setHeroImages(data);
      } else {
        // Luxury editorial fallbacks
        setHeroImages([
          { 
            id: '1', 
            image_url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=2000&auto=format&fit=crop', 
            sort_order: 1, 
            title: "The Art of Invisible Presence", 
            subtitle: "Handcrafted haute parfumerie capturing rare botanical distillations and magnetic sillage.", 
            button_text: "Explore The Collection", 
            button_link: "#collection" 
          },
          { 
            id: '2', 
            image_url: 'https://images.unsplash.com/photo-1595532542520-502947748256?q=80&w=2000&auto=format&fit=crop', 
            sort_order: 2, 
            title: "Distilled Elegance", 
            subtitle: "Formulated with precious resins, warm amber, and golden oud for profound longevity.", 
            button_text: "Discover Scents", 
            button_link: "#collection" 
          },
          { 
            id: '3', 
            image_url: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=2000&auto=format&fit=crop', 
            sort_order: 3, 
            title: "Wear Your Aura", 
            subtitle: "Fragrance designed not just to be worn, but to resonate with your signature identity.", 
            button_text: "View Gallery", 
            button_link: "#collection" 
          }
        ]);
      }
    };

    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("id", { ascending: false });

      if (error) {
        console.error("Supabase Error:", error);
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    };

    const fetchWishlist = async () => {
      if (user) {
        const { data } = await supabase
          .from("wishlist")
          .select("product_id")
          .eq("user_id", user.id);

        if (data) {
          setWishlist(new Set(data.map(item => item.product_id)));
        }
      } else {
        setWishlist(new Set());
      }
    };

    fetchHeroImages();
    fetchProducts();
    fetchWishlist();
  }, [user]);

  // Touch Swipe for Carousel
  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: import("framer-motion").PanInfo) => {
    if (info.offset.x < -50) {
      setCurrentSlide((prev) => (prev + 1) % (heroImages.length || 1));
    } else if (info.offset.x > 50) {
      setCurrentSlide((prev) => (prev - 1 + (heroImages.length || 1)) % (heroImages.length || 1));
    }
  };

  const handleToggleWishlist = async (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      router.push("/login");
      return;
    }

    const isInWishlist = wishlist.has(productId);

    if (isInWishlist) {
      const { error } = await supabase
        .from("wishlist")
        .delete()
        .eq("product_id", productId)
        .eq("user_id", user.id);

      if (!error) {
        const newWishlist = new Set(wishlist);
        newWishlist.delete(productId);
        setWishlist(newWishlist);
        toast.success("Removed from wishlist");
      }
    } else {
      const { error } = await supabase
        .from("wishlist")
        .insert([{ product_id: productId, user_id: user.id }]);

      if (!error) {
        const newWishlist = new Set(wishlist);
        newWishlist.add(productId);
        setWishlist(newWishlist);
        toast.success("Added to wishlist");
      }
    }
  };

  const fadeUpVariant = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } }
  };

  return (
    <main className="min-h-screen bg-[#0B0B0D] text-[#F2EFE9] pt-[72px] selection:bg-[#C9A461]/30 selection:text-[#F2EFE9] overflow-x-hidden">
      
      {/* ─── 1. HERO SECTION (Full-bleed Dark Cinematic Experience) ─── */}
      <section className="relative w-full h-[82vh] min-h-[580px] max-h-[920px] bg-[#0B0B0D] overflow-hidden flex items-center justify-center">
        
        {/* Atmospheric Scent Diffuser Radial Glow behind Hero */}
        <div className="absolute inset-0 z-10 scent-aura opacity-70"></div>
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0B0B0D] via-[#0B0B0D]/30 to-[#0B0B0D]/70 pointer-events-none"></div>
        <div className="absolute inset-0 z-10 bg-radial-vignette pointer-events-none"></div>
        
        <AnimatePresence initial={false} mode="wait">
          {heroImages.length > 0 && (
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              className="absolute inset-0 w-full h-full touch-pan-y"
            >
              <img
                src={heroImages[currentSlide].image_url}
                alt={heroImages[currentSlide].title || `Fragrance Bottle ${currentSlide + 1}`}
                className="absolute inset-0 w-full h-full object-cover object-center brightness-[0.55] contrast-[1.1] transition-transform duration-10000 ease-linear scale-105"
              />

              {/* Text Content Overlay */}
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6 max-w-5xl mx-auto">
                
                {/* Brand Tagline */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="flex items-center gap-2 mb-4"
                >
                  <span className="w-6 h-[1px] bg-[#C9A461]"></span>
                  <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#C9A461] font-sans font-medium">
                    WearAura Fragrance
                  </span>
                  <span className="w-6 h-[1px] bg-[#C9A461]"></span>
                </motion.div>

                {/* Hero Headline */}
                <motion.h1
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="text-4xl sm:text-6xl md:text-7xl font-serif text-[#F2EFE9] font-light leading-[1.08] tracking-tight mb-6 max-w-4xl drop-shadow-2xl"
                >
                  {heroImages[currentSlide].title || "The Art of Invisible Presence"}
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.45 }}
                  className="text-sm sm:text-base md:text-lg text-[#8C8880] font-light max-w-xl mb-10 leading-relaxed drop-shadow"
                >
                  {heroImages[currentSlide].subtitle || "Handcrafted haute parfumerie capturing rare botanical distillations and magnetic sillage."}
                </motion.p>

                {/* Single Clear CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <Link
                    href={heroImages[currentSlide].button_link || '#collection'}
                    className="inline-flex items-center gap-3 px-8 sm:px-10 py-4 bg-[#C9A461] hover:bg-[#DFC082] text-[#0B0B0D] font-sans text-xs uppercase tracking-[0.25em] font-semibold rounded-[2px] transition-all duration-300 shadow-xl shadow-black/50 hover:shadow-[#C9A461]/20 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <span>{heroImages[currentSlide].button_text || "Explore The Collection"}</span>
                    <ArrowUpRight className="w-4 h-4 stroke-[2px]" />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Carousel Indicators / Controls */}
        {heroImages.length > 1 && (
          <div className="absolute bottom-8 left-0 right-0 z-30 flex items-center justify-between px-8 max-w-7xl mx-auto pointer-events-none">
            <div className="flex gap-2.5 pointer-events-auto">
              {heroImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  aria-label={`Slide ${idx + 1}`}
                  className={`h-1 transition-all duration-500 rounded-full ${
                    currentSlide === idx ? 'w-8 bg-[#C9A461]' : 'w-2 bg-[#8C8880]/40 hover:bg-[#8C8880]'
                  }`}
                />
              ))}
            </div>

            <div className="hidden sm:flex gap-2 pointer-events-auto">
              <button
                onClick={() => setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length)}
                className="w-10 h-10 rounded-full border border-white/10 bg-[#0B0B0D]/60 backdrop-blur-sm text-[#F2EFE9] hover:text-[#C9A461] hover:border-[#C9A461]/40 flex items-center justify-center transition-colors"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % heroImages.length)}
                className="w-10 h-10 rounded-full border border-white/10 bg-[#0B0B0D]/60 backdrop-blur-sm text-[#F2EFE9] hover:text-[#C9A461] hover:border-[#C9A461]/40 flex items-center justify-center transition-colors"
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ─── SIGNATURE DIVIDER ─── */}
      <div className="aura-divider max-w-5xl mx-auto my-4 opacity-50"></div>

      {/* ─── 2. PRODUCT SECTION: "The Collection" ─── */}
      <section id="collection" className="container mx-auto px-6 py-20 md:py-28 max-w-7xl relative">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16 md:mb-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpVariant}
            className="flex items-center gap-2 mb-3"
          >
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C9A461] font-sans">Curated Selection</span>
          </motion.div>

          <motion.h2 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpVariant}
            className="text-4xl md:text-5xl lg:text-6xl font-serif font-light text-[#F2EFE9] tracking-tight mb-4"
          >
            The Collection
          </motion.h2>

          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpVariant}
            className="text-sm md:text-base text-[#8C8880] max-w-lg font-light leading-relaxed"
          >
            Formulated in concentrated extraits with notes that unfold gracefully over time.
          </motion.p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse bg-[#16151A] rounded-[2px] p-4 border border-white/[0.04]">
                <div className="w-full aspect-[3/4] bg-[#1F1E25] mb-5 rounded-[2px]" />
                <div className="h-4 bg-[#1F1E25] rounded w-3/4 mb-3" />
                <div className="h-3 bg-[#1F1E25] rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Product Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
              {products.slice(0, 4).map((product, idx) => {
                const comingSoon = product.status === 'coming_soon';
                const isSaved = wishlist.has(product.id);

                return (
                  <motion.div
                    key={product.id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: idx * 0.1 } }
                    }}
                    className="group relative flex flex-col bg-[#16151A] p-4 sm:p-5 rounded-[2px] border border-white/[0.04] hover:border-[rgba(201,164,97,0.35)] transition-all duration-500 hover:-translate-y-1.5 shadow-xl shadow-black/40"
                  >
                    {/* Ambient Glow behind Product Bottle on Hover */}
                    <div className="absolute inset-0 scent-aura-card rounded-[2px]"></div>

                    {comingSoon ? (
                      <div className="block relative w-full aspect-[3/4] bg-[#1F1E25] rounded-[2px] overflow-hidden mb-5">
                        {product.images && product.images.length > 0 ? product.images[0] : product.image_url ? (
                          <img
                            src={(product.images && product.images.length > 0) ? product.images[0] : (product.image_url || "")}
                            alt={product.name}
                            className="w-full h-full object-cover opacity-50 grayscale"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#8C8880]">
                            <span className="font-sans text-xs uppercase tracking-widest">No Image</span>
                          </div>
                        )}

                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                          <span className="bg-[#16151A] text-[#C9A461] border border-[#C9A461]/40 text-[10px] md:text-xs tracking-[0.25em] uppercase px-4 py-2 font-medium">
                            Coming Soon
                          </span>
                        </div>
                      </div>
                    ) : (
                      <Link 
                        href={`/products/${product.id}`} 
                        className="block relative w-full aspect-[3/4] bg-[#111014] rounded-[2px] overflow-hidden mb-5"
                      >
                        {product.images && product.images.length > 0 ? product.images[0] : product.image_url ? (
                          <img
                            src={(product.images && product.images.length > 0) ? product.images[0] : (product.image_url || "")}
                            alt={product.name}
                            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#8C8880]">
                            <span className="font-sans text-xs uppercase tracking-widest">No Image</span>
                          </div>
                        )}

                        {/* Category Tag Overlay */}
                        {product.category && (
                          <div className="absolute top-3 left-3">
                            <span className="bg-[#0B0B0D]/80 backdrop-blur-sm text-[#C9A461] border border-[rgba(201,164,97,0.2)] text-[9px] uppercase tracking-[0.25em] px-2.5 py-1 font-medium rounded-[1px]">
                              {product.category}
                            </span>
                          </div>
                        )}

                        {/* Wishlist Button */}
                        <button
                          onClick={(e) => handleToggleWishlist(e, product.id)}
                          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-300 ${
                            isSaved 
                              ? 'bg-[#C9A461] text-[#0B0B0D] shadow-lg' 
                              : 'bg-[#0B0B0D]/70 text-[#8C8880] opacity-80 group-hover:opacity-100 hover:text-[#C9A461] hover:bg-[#0B0B0D]'
                          }`}
                          aria-label="Toggle Wishlist"
                        >
                          <Heart className={`w-4 h-4 ${isSaved ? 'fill-[#0B0B0D]' : 'fill-none stroke-current'}`} />
                        </button>
                      </Link>
                    )}

                    {/* Product Metadata */}
                    <div className="flex flex-col text-left relative z-10">
                      {comingSoon ? (
                        <span className="font-serif text-[#F2EFE9] text-lg font-light mb-1">
                          {product.name}
                        </span>
                      ) : (
                        <Link 
                          href={`/products/${product.id}`} 
                          className="font-serif text-[#F2EFE9] text-xl font-light hover:text-[#C9A461] transition-colors mb-1.5 line-clamp-1"
                        >
                          {product.name}
                        </Link>
                      )}
                      
                      {/* Price / Status */}
                      <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/[0.04]">
                        {comingSoon ? (
                          <span className="font-sans text-xs text-[#8C8880] italic">
                            Price TBA
                          </span>
                        ) : (
                          <span className="font-sans text-base text-[#C9A461] font-medium tracking-tight">
                            ₹{Number(product.price).toFixed(2)}
                          </span>
                        )}

                        {!comingSoon && (
                          <Link 
                            href={`/products/${product.id}`}
                            className="text-[11px] uppercase tracking-[0.2em] text-[#8C8880] group-hover:text-[#F2EFE9] flex items-center gap-1 transition-colors"
                          >
                            <span>Details</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            
            {/* Explore More Button */}
            <div className="mt-16 md:mt-20 flex justify-center">
              <Link 
                href="/#collection" 
                className="inline-flex items-center gap-2 px-8 py-3.5 border border-[rgba(201,164,97,0.35)] text-[#F2EFE9] hover:bg-[#C9A461] hover:text-[#0B0B0D] hover:border-[#C9A461] transition-all duration-300 font-sans text-xs tracking-[0.25em] uppercase font-medium rounded-[2px]"
              >
                <span>View Full Anthology</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </>
        )}
      </section>

      {/* ─── 3. OLFACTORY ARCHITECTURE MOMENT ("Wear Your Aura") ─── */}
      <section className="relative w-full bg-[#16151A] py-24 md:py-32 px-6 border-y border-[rgba(201,164,97,0.15)] overflow-hidden">
        
        {/* Subtle amber ambient backdrop glow */}
        <div className="absolute inset-0 bg-radial-gradient from-[rgba(107,66,38,0.25)] via-transparent to-transparent pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[rgba(201,164,97,0.06)] blur-[140px] rounded-full pointer-events-none"></div>

        <div className="container mx-auto max-w-7xl relative z-10 flex flex-col items-center text-center">
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpVariant}
            className="flex items-center gap-2 mb-4"
          >
            <Compass className="w-4 h-4 text-[#C9A461]" />
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#C9A461] font-sans font-medium">
              The Architecture of Scent
            </span>
          </motion.div>

          <motion.h2 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpVariant}
            className="text-4xl sm:text-6xl md:text-7xl font-serif text-[#F2EFE9] font-light mb-6 leading-tight max-w-3xl"
          >
            Wear Your Aura
          </motion.h2>

          <motion.p
             initial="hidden"
             whileInView="visible"
             viewport={{ once: true, margin: "-100px" }}
             variants={fadeUpVariant}
             className="font-sans text-sm sm:text-base text-[#8C8880] max-w-2xl mx-auto mb-20 font-light leading-relaxed"
          >
            A bespoke fragrance is not merely an accessory — it is an invisible architecture that harmonizes with your body heat, creating an unmistakable presence.
          </motion.p>

          {/* Three Luxury Feature Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 w-full max-w-5xl mx-auto text-center">
            
            {/* Feature 1 */}
            <motion.div 
               initial="hidden"
               whileInView="visible"
               viewport={{ once: true, margin: "-50px" }}
               variants={{
                 hidden: { opacity: 0, y: 20 },
                 visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.1 } }
               }}
               className="flex flex-col items-center bg-[#0B0B0D]/60 p-8 rounded-[2px] border border-white/[0.04] hover:border-[rgba(201,164,97,0.3)] transition-colors group"
            >
              <div className="w-16 h-16 rounded-full bg-[#16151A] border border-[rgba(201,164,97,0.25)] flex items-center justify-center mb-6 group-hover:border-[#C9A461] transition-colors shadow-lg">
                <Clock className="text-[#C9A461] w-7 h-7 stroke-[1.5px]" />
              </div>
              <h3 className="font-serif text-[#F2EFE9] text-xl mb-3 font-light">Profound Longevity</h3>
              <p className="font-sans text-xs sm:text-sm text-[#8C8880] leading-relaxed font-light">
                High-concentration formulation engineered to release layers smoothly across 12+ hours of wear.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div 
               initial="hidden"
               whileInView="visible"
               viewport={{ once: true, margin: "-50px" }}
               variants={{
                 hidden: { opacity: 0, y: 20 },
                 visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } }
               }}
               className="flex flex-col items-center bg-[#0B0B0D]/60 p-8 rounded-[2px] border border-white/[0.04] hover:border-[rgba(201,164,97,0.3)] transition-colors group"
            >
              <div className="w-16 h-16 rounded-full bg-[#16151A] border border-[rgba(201,164,97,0.25)] flex items-center justify-center mb-6 group-hover:border-[#C9A461] transition-colors shadow-lg">
                <Sparkles className="text-[#C9A461] w-7 h-7 stroke-[1.5px]" />
              </div>
              <h3 className="font-serif text-[#F2EFE9] text-xl mb-3 font-light">Rare Distillations</h3>
              <p className="font-sans text-xs sm:text-sm text-[#8C8880] leading-relaxed font-light">
                Harvested from ethical botanical estates worldwide: Grasse roses, Mysore sandalwood, and ambergris.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
               initial="hidden"
               whileInView="visible"
               viewport={{ once: true, margin: "-50px" }}
               variants={{
                 hidden: { opacity: 0, y: 20 },
                 visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.3 } }
               }}
               className="flex flex-col items-center bg-[#0B0B0D]/60 p-8 rounded-[2px] border border-white/[0.04] hover:border-[rgba(201,164,97,0.3)] transition-colors group"
            >
              <div className="w-16 h-16 rounded-full bg-[#16151A] border border-[rgba(201,164,97,0.25)] flex items-center justify-center mb-6 group-hover:border-[#C9A461] transition-colors shadow-lg">
                <Shield className="text-[#C9A461] w-7 h-7 stroke-[1.5px]" />
              </div>
              <h3 className="font-serif text-[#F2EFE9] text-xl mb-3 font-light">Artisanal Mastery</h3>
              <p className="font-sans text-xs sm:text-sm text-[#8C8880] leading-relaxed font-light">
                Matured in small numbered batches to preserve purity, depth, and nuanced complexity on the skin.
              </p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ─── 4. BESPOKE SCENT CONSULTATION CTA ─── */}
      <section className="py-20 px-6 max-w-4xl mx-auto text-center">
        <div className="aura-divider mb-16 opacity-40"></div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#C9A461] mb-3">Client Services</p>
        <h3 className="text-3xl md:text-4xl font-serif text-[#F2EFE9] font-light mb-4">
          Seeking Your Personal Aura?
        </h3>
        <p className="text-[#8C8880] text-sm max-w-md mx-auto mb-8 font-light leading-relaxed">
          Our fragrance specialists are at your disposal to guide you towards a scent that matches your distinct profile.
        </p>
        <Link 
          href="/contact"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#C9A461] hover:text-[#DFC082] transition-colors border-b border-[#C9A461]/40 pb-1 hover:border-[#DFC082]"
        >
          <span>Speak with our Concierge</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </section>
      
    </main>
  );
}
