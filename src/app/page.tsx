"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import Link from "next/link";
import { useAuth } from "../components/AuthProvider";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  ShieldCheck,
  Sparkles,
  ArrowUpRight,
  ChevronRight,
  ChevronLeft,
  Heart,
  Compass,
  ArrowRight
} from "lucide-react";

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

  // Auto-play Carousel
  useEffect(() => {
    if (heroImages.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 9000);
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
        // Luxury editorial fallback
        setHeroImages([
          {
            id: "1",
            image_url:
              "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=2000&auto=format&fit=crop",
            sort_order: 1,
            title: "The Art of Invisible Presence",
            subtitle:
              "Handcrafted haute parfumerie capturing rare botanical distillations for a magnetic sillage.",
            button_text: "Explore The Collection",
            button_link: "#collection",
          },
          {
            id: "2",
            image_url:
              "https://images.unsplash.com/photo-1595532542520-502947748256?q=80&w=2000&auto=format&fit=crop",
            sort_order: 2,
            title: "Distilled Elegance",
            subtitle:
              "Formulated with precious resins, warm amber, and golden oud for profound longevity.",
            button_text: "Discover Fragrances",
            button_link: "#collection",
          },
        ]);
      }
    };

    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("name", { ascending: true });

      if (!error && data) {
        setProducts(data);
      }
      setLoading(false);
    };

    fetchHeroImages();
    fetchProducts();
  }, []);

  // Fetch user wishlist
  useEffect(() => {
    if (!user) return;
    const fetchWishlist = async () => {
      const { data, error } = await supabase
        .from("wishlist")
        .select("product_id")
        .eq("user_id", user.id);

      if (!error && data) {
        setWishlist(new Set(data.map((item) => item.product_id)));
      }
    };
    fetchWishlist();
  }, [user]);

  const toggleWishlist = async (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast("Please sign in to curate your wishlist", { icon: "✨" });
      router.push("/login");
      return;
    }

    const isFav = wishlist.has(productId);
    const newWishlist = new Set(wishlist);

    if (isFav) {
      newWishlist.delete(productId);
      setWishlist(newWishlist);
      const { error } = await supabase
        .from("wishlist")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", productId);

      if (error) {
        newWishlist.add(productId);
        setWishlist(newWishlist);
        toast.error("Failed to update wishlist");
      } else {
        toast.success("Removed from wishlist");
      }
    } else {
      newWishlist.add(productId);
      setWishlist(newWishlist);
      const { error } = await supabase
        .from("wishlist")
        .insert({ user_id: user.id, product_id: productId });

      if (error) {
        newWishlist.delete(productId);
        setWishlist(newWishlist);
        toast.error("Failed to update wishlist");
      } else {
        toast.success("Added to wishlist");
      }
    }
  };

  const currentHero = heroImages[currentSlide] || {
    title: "The Art of Invisible Presence",
    subtitle:
      "Handcrafted haute parfumerie capturing rare botanical distillations for a magnetic sillage.",
    button_text: "Explore The Collection",
    button_link: "#collection",
    image_url:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=2000&auto=format&fit=crop",
  };

  return (
    <div className="bg-[#131315] text-[#e5e1e4] min-h-screen">
      {/* 1. HERO SECTION (Maison Home) */}
      <section className="relative w-full h-[85vh] min-h-[580px] flex flex-col justify-end items-center pb-20 px-6 text-center overflow-hidden">
        {/* Background Image & Gradient */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 w-full h-full"
            >
              <img
                src={currentHero.image_url}
                alt={currentHero.title || "WearAura Haute Parfumerie"}
                className="w-full h-full object-cover object-center opacity-50"
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-[#131315] via-[#131315]/65 to-transparent"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center gap-5">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-xs uppercase tracking-[0.3em] text-[#e8c17b] font-medium"
          >
            WearAura Fragrance
          </motion.span>

          <motion.h1
            key={`title-${currentSlide}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-serif text-[#e5e1e4] leading-[1.15]"
          >
            {currentHero.title || "The Art of Invisible Presence"}
          </motion.h1>

          <motion.p
            key={`sub-${currentSlide}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm md:text-base text-[#d1c5b4] max-w-md leading-relaxed"
          >
            {currentHero.subtitle ||
              "Handcrafted haute parfumerie capturing rare botanical distillations for a magnetic sillage."}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-3"
          >
            <Link
              href={currentHero.button_link || "#collection"}
              className="inline-flex items-center justify-center gap-2 bg-[#c9a461] text-[#412d00] px-8 py-4 rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-[#e8c17b] transition-all duration-300 aura-glow"
            >
              <span>{currentHero.button_text || "Explore The Collection"}</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Carousel indicators */}
          {heroImages.length > 1 && (
            <div className="flex gap-2 mt-6">
              {heroImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1 transition-all rounded-full ${
                    idx === currentSlide
                      ? "w-8 bg-[#e8c17b]"
                      : "w-2 bg-[#9a8f80]/40 hover:bg-[#9a8f80]"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 2. THE COLLECTION SECTION */}
      <section className="py-24 px-6 max-w-[1400px] mx-auto" id="collection">
        <div className="text-center mb-16 space-y-3">
          <span className="text-xs font-medium text-[#e8c17b] tracking-[0.3em] uppercase block">
            Curated Selection
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#e5e1e4]">
            The Collection
          </h2>
          <p className="text-sm md:text-base text-[#d1c5b4] max-w-lg mx-auto leading-relaxed">
            Formulated in concentrated extraits with notes that unfold gracefully over time.
          </p>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="glass-panel p-6 rounded-2xl h-96 animate-pulse flex flex-col justify-between"
              >
                <div className="w-16 h-4 bg-[#2a2a2c] rounded"></div>
                <div className="w-full h-40 bg-[#201f21] rounded"></div>
                <div className="space-y-2">
                  <div className="w-3/4 h-5 bg-[#2a2a2c] rounded"></div>
                  <div className="w-1/2 h-4 bg-[#201f21] rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              const isFav = wishlist.has(product.id);
              const isSoldOut = product.stock <= 0;

              return (
                <div
                  key={product.id}
                  onClick={() => router.push(`/products/${product.id}`)}
                  className="glass-panel p-6 rounded-2xl flex flex-col group cursor-pointer transition-all duration-300 hover:-translate-y-1 relative"
                >
                  {/* Top Row: Category Badge & Wishlist */}
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] tracking-widest uppercase text-[#e8c17b] border border-[#e8c17b]/30 px-2 py-0.5 rounded font-mono">
                      {product.category || "Unisex"}
                    </span>
                    <button
                      onClick={(e) => toggleWishlist(product.id, e)}
                      aria-label="Wishlist"
                      className="text-[#d1c5b4] hover:text-[#e8c17b] transition-colors p-1"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isFav
                            ? "fill-[#e8c17b] text-[#e8c17b]"
                            : "text-[#d1c5b4] stroke-[1.5px]"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Product Image Container */}
                  <div className="flex-grow flex items-center justify-center py-10 mb-4 h-52 relative overflow-hidden">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-contain mix-blend-screen opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#d1c5b4]/40 font-serif italic">
                        WearAura Flacon
                      </div>
                    )}

                    {isSoldOut && (
                      <div className="absolute inset-0 bg-[#131315]/80 backdrop-blur-xs flex items-center justify-center rounded-lg">
                        <span className="text-[10px] uppercase tracking-widest text-[#ffb4ab] border border-[#ffb4ab]/40 px-3 py-1 rounded">
                          Sold Out
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Bottom Info */}
                  <div className="mt-auto">
                    <h3 className="text-lg font-serif text-[#e5e1e4] group-hover:text-[#e8c17b] transition-colors mb-1 truncate">
                      {product.name}
                    </h3>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm font-semibold text-[#e8c17b]">
                        ₹{Number(product.price).toFixed(2)}
                      </span>
                      <span className="text-xs text-[#d1c5b4] group-hover:text-[#e8c17b] transition-colors flex items-center gap-1 font-medium">
                        Details <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 glass-panel rounded-2xl p-12 max-w-xl mx-auto">
            <p className="text-[#d1c5b4] mb-4">No fragrances currently cataloged.</p>
            <Link
              href="/admin"
              className="inline-block text-xs uppercase tracking-widest text-[#e8c17b] border-b border-[#e8c17b]/40 pb-1"
            >
              Add First Fragrance
            </Link>
          </div>
        )}

        {/* View Full Anthology Link */}
        <div className="mt-16 text-center">
          <Link
            href="/#collection"
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.25em] uppercase text-[#d1c5b4] hover:text-[#e8c17b] transition-colors pb-1 border-b border-[#9a8f80]/30 hover:border-[#e8c17b]"
          >
            <span>View Full Anthology</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* 3. PHILOSOPHY / ARCHITECTURE OF SCENT SECTION */}
      <section className="py-24 px-6 bg-[#1c1b1d]/40 border-y border-[#9a8f80]/10 relative">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="w-12 h-12 rounded-full border border-[#e8c17b]/30 flex items-center justify-center mx-auto mb-6 text-[#e8c17b]">
            <Compass className="w-6 h-6 stroke-[1.5px]" />
          </div>
          <span className="text-xs font-medium text-[#e8c17b] tracking-[0.3em] uppercase mb-3 block">
            The Architecture of Scent
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#e5e1e4] mb-6">
            Wear Your Aura
          </h2>
          <p className="text-base md:text-lg text-[#d1c5b4] leading-relaxed max-w-2xl mx-auto">
            A bespoke fragrance is not merely an accessory — it is an invisible architecture
            that harmonizes with your body heat, creating an unmistakable presence.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[1300px] mx-auto">
          {/* Card 1: Longevity */}
          <div className="glass-panel p-8 rounded-2xl text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border border-[#e8c17b]/20 flex items-center justify-center mb-6 text-[#e8c17b]">
              <Clock className="w-5 h-5 stroke-[1.5px]" />
            </div>
            <h3 className="text-xl font-serif text-[#e5e1e4] mb-3">Profound Longevity</h3>
            <p className="text-sm text-[#d1c5b4]/80 leading-relaxed">
              High-concentration formulation engineered to release layers smoothly across
              12+ hours of wear.
            </p>
          </div>

          {/* Card 2: Rare Distillations */}
          <div className="glass-panel p-8 rounded-2xl text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border border-[#e8c17b]/20 flex items-center justify-center mb-6 text-[#e8c17b]">
              <Sparkles className="w-5 h-5 stroke-[1.5px]" />
            </div>
            <h3 className="text-xl font-serif text-[#e5e1e4] mb-3">Rare Distillations</h3>
            <p className="text-sm text-[#d1c5b4]/80 leading-relaxed">
              Harvested from ethical botanical estates worldwide: Grasse roses, Mysore
              sandalwood, and ambergris.
            </p>
          </div>

          {/* Card 3: Artisanal Mastery */}
          <div className="glass-panel p-8 rounded-2xl text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border border-[#e8c17b]/20 flex items-center justify-center mb-6 text-[#e8c17b]">
              <ShieldCheck className="w-5 h-5 stroke-[1.5px]" />
            </div>
            <h3 className="text-xl font-serif text-[#e5e1e4] mb-3">Artisanal Mastery</h3>
            <p className="text-sm text-[#d1c5b4]/80 leading-relaxed">
              Matured in small numbered batches to preserve purity, depth, and nuanced
              complexity on the skin.
            </p>
          </div>
        </div>
      </section>

      {/* 4. CONCIERGE CTA SECTION */}
      <section className="py-28 px-6 text-center max-w-3xl mx-auto">
        <span className="text-xs font-medium text-[#e8c17b] tracking-[0.3em] uppercase mb-4 block">
          Client Services
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#e5e1e4] mb-6">
          Seeking Your Personal Aura?
        </h2>
        <p className="text-sm md:text-base text-[#d1c5b4] max-w-md mx-auto mb-10 leading-relaxed">
          Our fragrance specialists are at your disposal to guide you towards a scent that
          matches your distinct profile.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center gap-2 bg-transparent border border-[#e8c17b] text-[#e8c17b] px-8 py-4 rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-[#e8c17b]/10 transition-colors"
        >
          <span>Speak With Our Concierge</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}
