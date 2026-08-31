"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, ChevronRight, SlidersHorizontal } from "lucide-react";
import { useAuth } from "../../components/AuthProvider";
import toast from "react-hot-toast";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string | null;
  stock: number;
  image_url: string | null;
  status: string;
}

export default function CollectionPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const { user } = useAuth();
  const router = useRouter();

  const filters = ["All", "Unisex", "Men", "Women", "Woody", "Floral", "Spicy"];

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("name", { ascending: true });

      if (!error && data) {
        setProducts(data);
        setFilteredProducts(data);
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!user) return;
    const currentUserId = user.id;
    async function fetchWishlist() {
      const { data } = await supabase
        .from("wishlist")
        .select("product_id")
        .eq("user_id", currentUserId);

      if (data) {
        setWishlist(new Set(data.map((i) => i.product_id)));
      }
    }
    fetchWishlist();
  }, [user]);


  const handleFilter = (filter: string) => {
    setActiveFilter(filter);
    if (filter === "All") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter(
          (p) =>
            p.category?.toLowerCase().includes(filter.toLowerCase()) ||
            p.description?.toLowerCase().includes(filter.toLowerCase()) ||
            p.name?.toLowerCase().includes(filter.toLowerCase())
        )
      );
    }
  };

  const toggleWishlist = async (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast("Please sign in to save fragrances", { icon: "✨" });
      router.push("/login");
      return;
    }

    const isFav = wishlist.has(productId);
    const newWishlist = new Set(wishlist);

    if (isFav) {
      newWishlist.delete(productId);
      setWishlist(newWishlist);
      await supabase
        .from("wishlist")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", productId);
      toast.success("Removed from saved");
    } else {
      newWishlist.add(productId);
      setWishlist(newWishlist);
      await supabase
        .from("wishlist")
        .insert({ user_id: user.id, product_id: productId });
      toast.success("Saved to wishlist");
    }
  };

  return (
    <main className="min-h-screen bg-[#131315] text-[#e5e1e4] pt-12 pb-28 px-6 max-w-[1400px] mx-auto">
      {/* Hero Section */}
      <section className="w-full flex flex-col items-center text-center gap-4 mb-14">
        <span className="text-xs font-medium text-[#e8c17b] tracking-[0.3em] uppercase">
          Curated Selection
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-[#e5e1e4]">
          The Collection
        </h1>
        <p className="text-sm md:text-base text-[#d1c5b4] max-w-xl mx-auto font-light leading-relaxed">
          Formulated in concentrated extraits with notes that unfold gracefully over time.
        </p>
      </section>

      {/* Filter Tabs */}
      <section className="w-full flex flex-wrap justify-center gap-3 border-b border-[#9a8f80]/15 pb-8 mb-14">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => handleFilter(filter)}
            className={`text-xs px-6 py-2.5 rounded-full border transition-all duration-300 font-medium tracking-wider uppercase ${
              activeFilter === filter
                ? "bg-[#c9a461] text-[#412d00] border-[#c9a461] shadow-lg shadow-[#c9a461]/15"
                : "border-[#9a8f80]/20 text-[#d1c5b4] hover:border-[#e8c17b] hover:text-[#e8c17b]"
            }`}
          >
            {filter === "All" ? "All Notes" : filter}
          </button>
        ))}
      </section>

      {/* Collection Grid */}
      <section className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          [1, 2, 3].map((n) => (
            <div
              key={n}
              className="glass-card rounded-2xl p-6 h-[420px] animate-pulse flex flex-col justify-between"
            >
              <div className="w-16 h-4 bg-[#2a2a2c] rounded"></div>
              <div className="w-full h-48 bg-[#201f21] rounded"></div>
              <div className="space-y-2">
                <div className="w-3/4 h-5 bg-[#2a2a2c] rounded"></div>
                <div className="w-1/2 h-4 bg-[#201f21] rounded"></div>
              </div>
            </div>
          ))
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((product) => {
            const isFav = wishlist.has(product.id);
            const isSoldOut = product.stock <= 0;

            return (
              <article
                key={product.id}
                onClick={() => router.push(`/products/${product.id}`)}
                className="glass-card aura-glow rounded-2xl p-6 flex flex-col justify-between group cursor-pointer transition-all duration-500 hover:-translate-y-1 relative"
              >
                {/* Badge & Wishlist */}
                <div className="w-full flex justify-between items-start mb-2">
                  <span className="text-[10px] font-medium tracking-widest uppercase text-[#e8c17b] border border-[#e8c17b]/30 px-2 py-0.5 rounded font-mono">
                    {product.category || "UNISEX"}
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

                {/* Image */}
                <div className="w-full h-64 relative flex items-center justify-center my-4 overflow-hidden">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="object-contain w-full h-full drop-shadow-2xl mix-blend-screen opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                    />
                  ) : (
                    <div className="text-[#d1c5b4]/40 font-serif italic text-sm">
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

                {/* Details */}
                <div className="w-full flex flex-col gap-2 mt-2 pt-4 border-t border-[#9a8f80]/15">
                  <h3 className="text-xl font-serif text-[#e5e1e4] group-hover:text-[#e8c17b] transition-colors truncate">
                    {product.name}
                  </h3>
                  <div className="w-full flex justify-between items-center mt-1">
                    <span className="text-sm font-semibold text-[#e8c17b]">
                      ₹{Number(product.price).toFixed(2)}
                    </span>
                    <span className="text-xs text-[#d1c5b4] flex items-center gap-1 group-hover:text-[#e8c17b] transition-colors font-medium">
                      DETAILS <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <div className="col-span-full py-16 text-center glass-card rounded-2xl p-12 max-w-xl mx-auto">
            <p className="text-[#d1c5b4] mb-4">No fragrances match this olfactory note.</p>
            <button
              onClick={() => handleFilter("All")}
              className="text-xs uppercase tracking-widest text-[#e8c17b] border-b border-[#e8c17b]/40 pb-1"
            >
              View All Notes
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
