"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "../../lib/supabase";
import Link from "next/link";
import { useAuth } from "../components/AuthProvider";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Shield, Sparkles } from "lucide-react";

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
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % (heroImages.length || 1));
    }, 20000); // Changed to 20 seconds
    return () => clearInterval(timer);
  }, []);

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
        // Fallback
        setHeroImages([
          { id: '1', image_url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=2000&auto=format&fit=crop', sort_order: 1, title: null, subtitle: null, button_text: null, button_link: null },
          { id: '2', image_url: 'https://images.unsplash.com/photo-1595532542520-502947748256?q=80&w=2000&auto=format&fit=crop', sort_order: 2, title: null, subtitle: null, button_text: null, button_link: null },
          { id: '3', image_url: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=2000&auto=format&fit=crop', sort_order: 3, title: null, subtitle: null, button_text: null, button_link: null }
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
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: import("framer-motion").PanInfo) => {
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
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <main className="min-h-screen bg-[#FAF9F6] text-[#1a1a1a] pt-[64px] md:pt-[80px]">
      
      {/* 1. HERO SECTION (Image Carousel) */}
      <section className="relative w-full h-[50vh] bg-[#1a1a1a] overflow-hidden aspect-video max-h-[1000px] mx-auto">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
        
                <AnimatePresence initial={false} custom={currentSlide}>
          {heroImages.length > 0 && (
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={handleDragEnd}
              className="absolute inset-0 w-full h-full touch-pan-y"
            >
              <img
                src={heroImages[currentSlide].image_url}
                alt={heroImages[currentSlide].title || `Hero Image ${currentSlide + 1}`}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {(heroImages[currentSlide].title || heroImages[currentSlide].subtitle) && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-6 bg-black/20">
                  {heroImages[currentSlide].title && (
                    <h1 className="text-4xl md:text-6xl font-serif text-white mb-4 drop-shadow-md">
                      {heroImages[currentSlide].title}
                    </h1>
                  )}
                  {heroImages[currentSlide].subtitle && (
                    <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl drop-shadow">
                      {heroImages[currentSlide].subtitle}
                    </p>
                  )}
                  {heroImages[currentSlide].button_text && (
                    <Link
                      href={heroImages[currentSlide].button_link || '#'}
                      className="px-8 py-3 bg-white text-[#1a1a1a] font-medium tracking-wide rounded hover:bg-[#FAF9F6] transition-colors shadow-lg"
                    >
                      {heroImages[currentSlide].button_text}
                    </Link>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>


      </section>

      {/* 2. PRODUCT SECTION - "The Collection" */}
      <section id="collection" className="container mx-auto px-[24px] py-[64px] md:py-[96px] max-w-7xl">
        <motion.h2 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariant}
          className="text-[48px] md:text-[56px] font-serif text-[#1a1a1a] text-center mb-12 md:mb-16"
        >
          The Collection
        </motion.h2>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-[16px] md:gap-[24px]">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="w-full aspect-[3/4] bg-[#f0eeea] mb-4 rounded-[2px]" />
                <div className="h-4 bg-[#e8e6e1] rounded w-3/4 mb-2" />
                <div className="h-4 bg-[#e8e6e1] rounded w-1/4" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-[16px] md:gap-[24px]">
              {products.slice(0, 4).map((product, idx) => {
                const comingSoon = product.status === 'coming_soon';

                return (
                  <motion.div
                    key={product.id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: idx * 0.1 } }
                    }}
                    className="group relative flex flex-col"
                  >
                    {comingSoon ? (
                      <div className="block relative w-full aspect-[3/4] bg-[#f0eeea] rounded-[2px] overflow-hidden mb-4">
                        {product.images && product.images.length > 0 ? product.images[0] : product.image_url ? (
                          <img
                            src={(product.images && product.images.length > 0) ? product.images[0] : (product.image_url || "")}
                            alt={product.name}
                            className="w-full h-full object-cover opacity-70"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#8a8a8a]">
                            <span className="font-sans text-sm">No Image</span>
                          </div>
                        )}

                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <span className="bg-white/90 text-[#1a1a1a] text-xs md:text-sm tracking-widest uppercase px-4 md:px-6 py-2">
                            COMING SOON
                          </span>
                        </div>
                      </div>
                    ) : (
                      <Link href={`/products/${product.id}`} className="block relative w-full aspect-[3/4] bg-[#f0eeea] rounded-[2px] overflow-hidden mb-4">
                        {product.images && product.images.length > 0 ? product.images[0] : product.image_url ? (
                          <img
                            src={(product.images && product.images.length > 0) ? product.images[0] : (product.image_url || "")}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#8a8a8a]">
                            <span className="font-sans text-sm">No Image</span>
                          </div>
                        )}

                        {/* Wishlist Button (Optional over image) */}
                        <button
                          onClick={(e) => handleToggleWishlist(e, product.id)}
                          className={`absolute bottom-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full transition-all duration-300 ${
                            wishlist.has(product.id) ? 'text-[#1a1a1a] shadow-md' : 'text-[#8a8a8a] opacity-0 group-hover:opacity-100 hover:text-[#1a1a1a]'
                          }`}
                          aria-label="Toggle Wishlist"
                        >
                           <svg className={`w-5 h-5 ${wishlist.has(product.id) ? 'fill-[#1a1a1a]' : 'fill-none stroke-current'}`} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                           </svg>
                        </button>
                      </Link>
                    )}

                    <div className="flex flex-col text-left">
                      {comingSoon ? (
                        <span className="font-sans text-[#1a1a1a] text-base font-medium mb-1">
                          {product.name}
                        </span>
                      ) : (
                        <Link href={`/products/${product.id}`} className="font-sans text-[#1a1a1a] text-base font-medium hover:underline decoration-1 underline-offset-4 mb-1">
                          {product.name}
                        </Link>
                      )}
                      
                      {comingSoon ? (
                        <span className="font-sans text-sm text-[#8a8a8a] italic">
                          Price TBA
                        </span>
                      ) : (
                        <span className="font-sans text-sm text-[#1a1a1a]">
                          ₹{Number(product.price).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
            
            {/* Explore More Button */}
            <div className="mt-12 md:mt-16 flex justify-center">
              <Link href="/#collection" className="inline-flex items-center justify-center px-8 py-3 border border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#FAF9F6] transition-colors duration-300 font-sans text-sm tracking-widest uppercase">
                Explore More
              </Link>
            </div>
          </>
        )}
      </section>

      {/* 3. FRAGRANCE GUIDE SECTION - "Wear Your Aura" */}
      <section className="w-full bg-gradient-to-r from-[#2d1b3d] via-[#3d2a4d] to-[#4a3558] py-[80px] md:py-[96px] px-[24px]">
        <div className="container mx-auto max-w-7xl flex flex-col items-center text-center">
          <motion.h2 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpVariant}
            className="text-[64px] md:text-[80px] font-serif text-white mb-6 leading-tight"
          >
            Wear Your Aura
          </motion.h2>
          <motion.p
             initial="hidden"
             whileInView="visible"
             viewport={{ once: true, margin: "-100px" }}
             variants={fadeUpVariant}
             className="font-sans text-[18px] text-[#c4a8d4] max-w-[672px] mx-auto mb-16"
          >
            Experience a fragrance that blends richness with elegance.
          </motion.p>

          <div className="grid grid-cols-3 gap-6 md:gap-12 w-full max-w-4xl mx-auto">
            {/* Feature 1 */}
            <motion.div 
               initial="hidden"
               whileInView="visible"
               viewport={{ once: true, margin: "-50px" }}
               variants={{
                 hidden: { opacity: 0, y: 10 },
                 visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.1 } }
               }}
               className="flex flex-col items-center"
            >
              <div className="w-[64px] h-[64px] rounded-full bg-white/10 border border-white/20 flex items-center justify-center mb-4">
                <Clock className="text-white w-8 h-8" />
              </div>
              <h3 className="font-serif text-white text-lg md:text-xl mb-2">Long-Lasting</h3>
              <p className="font-sans text-sm text-[#c4a8d4] max-w-[200px]">Endures elegantly throughout the day.</p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div 
               initial="hidden"
               whileInView="visible"
               viewport={{ once: true, margin: "-50px" }}
               variants={{
                 hidden: { opacity: 0, y: 10 },
                 visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } }
               }}
               className="flex flex-col items-center"
            >
              <div className="w-[64px] h-[64px] rounded-full bg-white/10 border border-white/20 flex items-center justify-center mb-4">
                <Sparkles className="text-white w-8 h-8" />
              </div>
              <h3 className="font-serif text-white text-lg md:text-xl mb-2">Rich Ingredients</h3>
              <p className="font-sans text-sm text-[#c4a8d4] max-w-[200px]">Sourced from the finest botanicals globally.</p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
               initial="hidden"
               whileInView="visible"
               viewport={{ once: true, margin: "-50px" }}
               variants={{
                 hidden: { opacity: 0, y: 10 },
                 visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.3 } }
               }}
               className="flex flex-col items-center"
            >
              <div className="w-[64px] h-[64px] rounded-full bg-white/10 border border-white/20 flex items-center justify-center mb-4">
                <Shield className="text-white w-8 h-8" />
              </div>
              <h3 className="font-serif text-white text-lg md:text-xl mb-2">Luxurious Strength</h3>
              <p className="font-sans text-sm text-[#c4a8d4] max-w-[200px]">A bold profile that commands attention.</p>
            </motion.div>
          </div>
        </div>
      </section>
      
    </main>
  );
}
