"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../components/AuthProvider";
import { supabase } from "../../../lib/supabase";
import toast from "react-hot-toast";
import { isAdminEmail } from "../../../lib/adminConfig";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ShoppingBag,
  Package as PackageIcon,
  MessageSquare,
  Menu,
  X,
  DollarSign,
  TrendingUp,
  ChevronDown,
  Trash2,
  Edit2,
  Upload,
  Image as LucideImage,
  Plus,
  Loader2,
  Clock,
  CheckCircle,
  AlertCircle,
  Save,
  Search,
  ExternalLink,
  LogOut,
  Sparkles,
  ArrowUpDown,
  Check,
  Star,
} from "lucide-react";
import HeroManagement from "./HeroManagement";

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
interface Profile {
  id: string;
  role: string | null;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category?: string | null;
  stock: number;
  image_url: string | null;
  images?: string[];
  status: string;
  top_notes?: string | null;
  middle_notes?: string | null;
  base_notes?: string | null;
  mood?: string | null;
  size_ml?: number | null;
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
  products?: OrderProduct | null;
  name?: string;
  image_url?: string | null;
}

interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: string;
  payment_method: string | null;
  razorpay_payment_id: string | null;
  created_at: string;
  full_name?: string | null;
  phone_number?: string | null;
  shipping_address?: string | null;
  address_line1?: string | null;
  address_line2?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  items_snapshot?: Array<{
    id?: string;
    product_id?: string;
    name?: string;
    title?: string;
    quantity: number;
    price: number;
    image_url?: string;
  }> | null;
  order_items?: OrderItem[];
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

/* ─────────────────────────────────────────────
   HELPERS & CONSTANTS
───────────────────────────────────────────── */
const ORDER_STATUSES = [
  { value: "pending",     label: "Pending",     cls: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  { value: "cod_pending", label: "COD Pending", cls: "bg-amber-100 text-amber-800 border-amber-200" },
  { value: "paid",        label: "Paid",        cls: "bg-blue-100 text-blue-800 border-blue-200" },
  { value: "processing",  label: "Processing",  cls: "bg-purple-100 text-purple-800 border-purple-200" },
  { value: "shipped",     label: "Shipped",     cls: "bg-indigo-100 text-indigo-800 border-indigo-200" },
  { value: "delivered",   label: "Delivered",   cls: "bg-green-100 text-green-800 border-green-200" },
  { value: "cancelled",   label: "Cancelled",   cls: "bg-gray-100 text-gray-800 border-gray-200" },
  { value: "failed",      label: "Failed",      cls: "bg-red-100 text-red-800 border-red-200" },
];

function statusClass(status: string) {
  return ORDER_STATUSES.find((s) => s.value === status)?.cls ?? "bg-[#f0eeea] text-[#8a8a8a] border-[#e8e6e1]";
}

const EMPTY_PRODUCT = {
  name: "",
  description: "",
  price: "",
  category: "Unisex",
  stock: "10",
  image_url: "",
  status: "available",
  top_notes: "",
  middle_notes: "",
  base_notes: "",
  mood: "",
  size_ml: "50",
};

// Curated luxury perfume imagery presets for quick testing
const LUXURY_PRESET_IMAGES = [
  "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1200&auto=format&fit=crop",
];

/* ─────────────────────────────────────────────
   SKELETON ROW
───────────────────────────────────────────── */
function SkeletonRow({ cols }: { cols: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-4 bg-[#e8e6e1] rounded animate-pulse" style={{ width: i === 0 ? "65%" : "40%" }} />
        </td>
      ))}
    </tr>
  );
}

/* ─────────────────────────────────────────────
   STAT CARD
───────────────────────────────────────────── */
function StatCard({
  icon: Icon,
  label,
  value,
  subtitle,
  accent,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  subtitle?: string;
  accent?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`rounded-[4px] border p-6 shadow-sm flex items-center gap-4 transition-all duration-200 ${
        onClick ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-md" : ""
      } ${
        accent
          ? "bg-gradient-to-br from-[#2d1b3d] to-[#1a1a1a] border-[#3d2a4d] text-white relative overflow-hidden"
          : "bg-white border-[#e8e6e1] text-[#1a1a1a]"
      }`}
    >
      {accent && (
        <div className="absolute top-0 right-0 w-28 h-28 bg-white opacity-5 rounded-full -translate-y-4 translate-x-4 blur-2xl" />
      )}
      <div className={`p-3.5 rounded-full relative z-10 flex-shrink-0 ${accent ? "bg-white/10" : "bg-[#f0eeea]"}`}>
        <Icon className={`w-6 h-6 ${accent ? "text-[#FAF9F6]" : "text-[#1a1a1a]"}`} />
      </div>
      <div className="relative z-10 min-w-0">
        <p className={`text-xs font-semibold uppercase tracking-wider ${accent ? "text-[#c4a8d4]" : "text-[#8a8a8a]"}`}>
          {label}
        </p>
        <p className={`text-2xl font-serif mt-0.5 ${accent ? "text-[#FAF9F6]" : "text-[#1a1a1a]"}`}>
          {value}
        </p>
        {subtitle && (
          <p className={`text-xs mt-1 ${accent ? "text-white/70" : "text-[#8a8a8a]"}`}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PRODUCT MODAL (Full 11-field form + Image Manager)
───────────────────────────────────────────── */
function ProductModal({
  product,
  onClose,
  onSaved,
}: {
  product: Product | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!product;
  const [form, setForm] = useState({ ...EMPTY_PRODUCT });
  const [images, setImages] = useState<string[]>([]);
  const [newUrlInput, setNewUrlInput] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        description: product.description || "",
        price: product.price?.toString() || "",
        category: product.category || "Unisex",
        stock: product.stock?.toString() || "0",
        image_url: product.image_url || "",
        status: product.status || "available",
        top_notes: product.top_notes || "",
        middle_notes: product.middle_notes || "",
        base_notes: product.base_notes || "",
        mood: product.mood || "",
        size_ml: product.size_ml?.toString() || "50",
      });

      const list: string[] = [];
      if (product.images && Array.isArray(product.images) && product.images.length > 0) {
        list.push(...product.images);
      } else if (product.image_url) {
        list.push(product.image_url);
      }
      setImages(list);
    } else {
      setForm({ ...EMPTY_PRODUCT });
      setImages([]);
    }
  }, [product]);

  // Handle adding image via URL
  const handleAddImageUrl = () => {
    const trimmed = newUrlInput.trim();
    if (!trimmed) return;
    if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
      toast.error("Please enter a valid HTTP/HTTPS image URL");
      return;
    }
    setImages((prev) => [...prev, trimmed]);
    setNewUrlInput("");
  };

  // Handle adding image via local file selection (FileReader data URL)
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`File ${file.name} exceeds 5MB limit`);
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (dataUrl) {
          setImages((prev) => [...prev, dataUrl]);
        }
      };
      reader.readAsDataURL(file);
    });
    // Reset file input
    e.target.value = "";
  };

  // Promote image to main
  const handleSetMain = (index: number) => {
    if (index === 0) return;
    setImages((prev) => {
      const copy = [...prev];
      const [item] = copy.splice(index, 1);
      return [item, ...copy];
    });
    toast.success("Main image updated");
  };

  // Remove image
  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Add sample preset images
  const handleAddPresets = () => {
    setImages((prev) => {
      const newItems = LUXURY_PRESET_IMAGES.filter((url) => !prev.includes(url));
      if (newItems.length === 0) {
        toast("Preset images already included", { icon: "ℹ️" });
        return prev;
      }
      return [...prev, ...newItems];
    });
    toast.success("Added luxury fragrance presets");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Product name is required");
      return;
    }
    if (!form.price || isNaN(Number(form.price))) {
      toast.error("Valid price is required");
      return;
    }

    setSaving(true);
    try {
      const mainImageUrl = images.length > 0 ? images[0] : null;

      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: parseFloat(form.price) || 0,
        category: form.category.trim() || "Unisex",
        stock: parseInt(form.stock, 10) || 0,
        status: form.status,
        images: images,
        image_url: mainImageUrl,
        top_notes: form.top_notes.trim() || null,
        middle_notes: form.middle_notes.trim() || null,
        base_notes: form.base_notes.trim() || null,
        mood: form.mood.trim() || null,
        size_ml: form.size_ml ? parseFloat(form.size_ml) : null,
      };

      let error;
      if (isEdit && product) {
        ({ error } = await supabase.from("products").update(payload).eq("id", product.id));
      } else {
        ({ error } = await supabase.from("products").insert([payload]));
      }

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success(isEdit ? "Product updated successfully" : "Product created successfully");
      onSaved();
      onClose();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const inp = (
    label: string,
    key: keyof typeof form,
    opts?: { type?: string; step?: string; placeholder?: string; required?: boolean }
  ) => (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-[#4a4a4a] uppercase tracking-wider block">
        {label}
        {opts?.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={opts?.type || "text"}
        step={opts?.step}
        placeholder={opts?.placeholder}
        required={opts?.required}
        value={form[key] as string}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        className="w-full bg-[#f5f4f0] border border-[#e8e6e1] px-3.5 py-2.5 rounded-[2px] text-sm focus:outline-none focus:border-[#1a1a1a] text-[#1a1a1a] placeholder:text-[#b0aea8] transition-colors"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.18 }}
        className="bg-white w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-[4px] shadow-2xl border border-[#e8e6e1] flex flex-col"
      >
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 bg-[#FAF9F6] border-b border-[#e8e6e1] px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl tracking-wide text-[#1a1a1a]">
              {isEdit ? "Edit Product" : "Add New Product"}
            </h2>
            <p className="text-xs text-[#8a8a8a] mt-0.5">
              Enter product fragrance specifications, imagery, pricing, and inventory
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#8a8a8a] hover:text-[#1a1a1a] p-1.5 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form id="product-form" onSubmit={handleSubmit} className="p-6 space-y-6 flex-1">
          {/* Row 1: Name & Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inp("Product Name", "name", { required: true, placeholder: "e.g. Noir Élégance" })}
            {inp("Price (₹)", "price", { type: "number", step: "0.01", required: true, placeholder: "e.g. 2499.00" })}
          </div>

          {/* Row 2: Stock, Size, Category, Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {inp("Stock Qty", "stock", { type: "number", placeholder: "10" })}
            {inp("Size (ml)", "size_ml", { type: "number", step: "1", placeholder: "e.g. 50" })}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#4a4a4a] uppercase tracking-wider block">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="w-full bg-[#f5f4f0] border border-[#e8e6e1] px-3.5 py-2.5 rounded-[2px] text-sm focus:outline-none focus:border-[#1a1a1a] text-[#1a1a1a]"
              >
                <option value="Unisex">Unisex</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Discovery Set">Discovery Set</option>
                <option value="Limited Edition">Limited Edition</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#4a4a4a] uppercase tracking-wider block">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                className="w-full bg-[#f5f4f0] border border-[#e8e6e1] px-3.5 py-2.5 rounded-[2px] text-sm focus:outline-none focus:border-[#1a1a1a] text-[#1a1a1a]"
              >
                <option value="available">Available</option>
                <option value="coming_soon">Coming Soon</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#4a4a4a] uppercase tracking-wider block">
              Description
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="w-full bg-[#f5f4f0] border border-[#e8e6e1] px-3.5 py-2.5 rounded-[2px] text-sm focus:outline-none focus:border-[#1a1a1a] text-[#1a1a1a] resize-none placeholder:text-[#b0aea8]"
              placeholder="Describe the fragrance story, notes, and sensory experience..."
            />
          </div>

          {/* Fragrance Olfactory Notes */}
          <div className="bg-[#FAF9F6] border border-[#e8e6e1] p-4 rounded-[3px] space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#8a8a8a]" />
              <p className="text-xs font-semibold text-[#1a1a1a] uppercase tracking-wider">
                Olfactory Pyramid & Fragrance Notes
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {inp("Top Notes", "top_notes", { placeholder: "e.g. Italian Bergamot, Pink Pepper" })}
              {inp("Heart Notes", "middle_notes", { placeholder: "e.g. Damask Rose, Jasmine Sambac" })}
              {inp("Base Notes", "base_notes", { placeholder: "e.g. Amberwood, Madagascar Vanilla" })}
            </div>
          </div>

          {/* Mood / Best For */}
          {inp("Mood / Best For", "mood", { placeholder: "e.g. Evening Gala, Romantic Date, Warm & Cozy" })}

          {/* Product Images Manager */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-semibold text-[#4a4a4a] uppercase tracking-wider block">
                  Product Images
                </label>
                <p className="text-xs text-[#8a8a8a]">
                  Add multiple images. The first image is the primary storefront thumbnail.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddPresets}
                className="text-xs text-[#1a1a1a] underline underline-offset-2 hover:opacity-80 transition-opacity"
              >
                + Add sample luxury photos
              </button>
            </div>

            {/* Image URL input row */}
            <div className="flex gap-2">
              <input
                type="url"
                value={newUrlInput}
                onChange={(e) => setNewUrlInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddImageUrl();
                  }
                }}
                placeholder="Paste Image URL (https://...)"
                className="flex-1 bg-[#f5f4f0] border border-[#e8e6e1] px-3.5 py-2 rounded-[2px] text-xs focus:outline-none focus:border-[#1a1a1a] text-[#1a1a1a] placeholder:text-[#b0aea8]"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="px-3 py-2 bg-[#1a1a1a] text-white rounded-[2px] text-xs font-medium hover:bg-[#333] transition-colors"
              >
                Add URL
              </button>
            </div>

            {/* Images Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 pt-2">
              {images.map((url, i) => (
                <div
                  key={`img-${i}`}
                  className="relative aspect-square border border-[#e8e6e1] rounded-[2px] overflow-hidden group bg-[#FAF9F6]"
                >
                  <img src={url} alt={`Product preview ${i + 1}`} className="w-full h-full object-cover" />

                  {/* Badges & Actions */}
                  {i === 0 ? (
                    <span className="absolute bottom-1 left-1 text-[9px] uppercase tracking-wider bg-black/80 text-white px-1.5 py-0.5 rounded-[1px] font-semibold">
                      Main
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSetMain(i)}
                      className="absolute bottom-1 left-1 text-[9px] uppercase tracking-wider bg-white/90 text-[#1a1a1a] px-1.5 py-0.5 rounded-[1px] font-medium opacity-0 group-hover:opacity-100 hover:bg-white transition-opacity shadow-sm"
                      title="Set as main thumbnail"
                    >
                      Make Main
                    </button>
                  )}

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="absolute top-1 right-1 bg-black/70 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all"
                    title="Remove image"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {/* Upload from device box */}
              <label className="flex flex-col items-center justify-center aspect-square border border-[#e8e6e1] border-dashed rounded-[2px] cursor-pointer hover:bg-[#f5f4f0] bg-white text-[#8a8a8a] transition-colors p-2 text-center group">
                <Upload className="w-5 h-5 mb-1 group-hover:text-[#1a1a1a] transition-colors" />
                <span className="text-[10px] uppercase tracking-wider font-semibold group-hover:text-[#1a1a1a] transition-colors">
                  Upload File
                </span>
                <span className="text-[8px] text-[#aaa]">JPG, PNG, WebP</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </label>
            </div>
          </div>
        </form>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 bg-[#FAF9F6] border-t border-[#e8e6e1] px-6 py-4 flex justify-end gap-3 z-20">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="px-5 py-2.5 border border-[#e8e6e1] text-[#4a4a4a] hover:bg-[#e8e6e1] transition-colors rounded-[2px] text-sm font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="product-form"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#1a1a1a] text-white hover:bg-[#333] transition-colors rounded-[2px] text-sm font-medium disabled:opacity-60 shadow-sm"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Product"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN ADMIN PAGE
───────────────────────────────────────────── */
export default function AdminPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<"dashboard" | "orders" | "products" | "reviews" | "hero">("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productSearch, setProductSearch] = useState("");
  const [productStatusFilter, setProductStatusFilter] = useState<"all" | "available" | "coming_soon">("all");

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("all");

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  // Modals & action states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  /* ── Data Fetchers ── */
  const fetchProducts = useCallback(async () => {
    setProductsLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("id, name, description, price, category, stock, image_url, images, status, top_notes, middle_notes, base_notes, mood, size_ml")
      .order("id", { ascending: false });
    if (!error && data) {
      setProducts(data);
    }
    setProductsLoading(false);
  }, []);

  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("id, user_id, total_amount, status, payment_method, razorpay_payment_id, created_at, full_name, phone_number, shipping_address, address_line1, address_line2, city, state, pincode, items_snapshot, order_items (id, quantity, price, product_id, products (id, name, image_url))")
      .order("created_at", { ascending: false });
    if (!error && data) {
      setOrders(data as unknown as Order[]);
    }
    setOrdersLoading(false);
  }, []);

  const fetchReviews = useCallback(async () => {
    setReviewsLoading(true);
    const { data, error } = await supabase
      .from("reviews")
      .select("id, rating, comment, created_at, product_id, user_id, products (name)")
      .order("created_at", { ascending: false });
    if (!error && data) {
      setReviews((data as unknown as Review[]) || []);
    }
    setReviewsLoading(false);
  }, []);

  /* ── Auth Gate ── */
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const { data } = await supabase
          .from("profiles")
          .select("id, role")
          .eq("id", user.id)
          .single();

        if (data?.role === "admin" || isAdminEmail(user.email)) {
          setProfile(data ?? { id: user.id, role: "admin" });
        } else {
          toast.error("Access denied. Admin privileges required.");
          router.push("/");
        }
      } catch {
        router.push("/");
      } finally {
        setProfileLoading(false);
      }
    })();
  }, [user, router]);

  useEffect(() => {
    if (profile?.role === "admin") {
      fetchProducts();
      fetchOrders();
      fetchReviews();
    }
  }, [profile?.role, fetchProducts, fetchOrders, fetchReviews]);

  /* ── Product Handlers ── */
  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;
    setDeletingProductId(id);
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Product deleted");
      setProducts((prev) => prev.filter((x) => x.id !== id));
    }
    setDeletingProductId(null);
  };

  /* ── Order Handlers ── */
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingOrderId(orderId);
    const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", orderId);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(`Order #${orderId.slice(0, 8).toUpperCase()} updated to ${newStatus}`);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    }
    setUpdatingOrderId(null);
  };

  /* ── Review Handlers ── */
  const handleDeleteReview = async (id: string) => {
    if (!window.confirm("Delete this product review?")) return;
    setDeletingReviewId(id);
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Review deleted");
      setReviews((prev) => prev.filter((x) => x.id !== id));
    }
    setDeletingReviewId(null);
  };

  /* ── Loading Screen ── */
  if (loading || profileLoading || (!user && !loading)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF9F6] text-[#1a1a1a]">
        <Loader2 className="w-8 h-8 animate-spin text-[#1a1a1a] mb-4" />
        <p className="font-serif text-lg tracking-wide">Authenticating Admin Access…</p>
      </div>
    );
  }

  if (profile?.role !== "admin") return null;

  /* ── Filtered Data ── */
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !productSearch ||
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      (p.mood && p.mood.toLowerCase().includes(productSearch.toLowerCase())) ||
      (p.category && p.category.toLowerCase().includes(productSearch.toLowerCase()));

    const matchesStatus =
      productStatusFilter === "all" || p.status === productStatusFilter;

    return matchesSearch && matchesStatus;
  });

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      !orderSearch ||
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      (o.full_name && o.full_name.toLowerCase().includes(orderSearch.toLowerCase())) ||
      (o.phone_number && o.phone_number.includes(orderSearch)) ||
      (o.city && o.city.toLowerCase().includes(orderSearch.toLowerCase()));

    const matchesStatus =
      orderStatusFilter === "all" || o.status === orderStatusFilter;

    return matchesSearch && matchesStatus;
  });

  /* ── Summary Stats ── */
  const totalRevenue = orders
    .filter((o) => o.status !== "failed" && o.status !== "cancelled")
    .reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);

  const pendingCount = orders.filter(
    (o) => o.status === "pending" || o.status === "cod_pending"
  ).length;

  const todayOrders = orders.filter(
    (o) => new Date(o.created_at).toDateString() === new Date().toDateString()
  ).length;

  const NAV = [
    { id: "dashboard" as const, label: "Dashboard",   icon: LayoutDashboard },
    { id: "orders"    as const, label: "Orders",       icon: ShoppingBag, count: pendingCount },
    { id: "products"  as const, label: "Products",     icon: PackageIcon, count: products.length },
    { id: "reviews"   as const, label: "Reviews",      icon: MessageSquare, count: reviews.length },
    { id: "hero"      as const, label: "Hero Slides",  icon: LucideImage },
  ];

  /* ═══════════════════════════════════════════
     DASHBOARD OVERVIEW
  ═══════════════════════════════════════════ */
  const renderDashboard = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          icon={PackageIcon}
          label="Total Products"
          value={products.length}
          subtitle={`${products.filter((p) => p.status === "available").length} Active in Catalog`}
          onClick={() => setActiveTab("products")}
        />
        <StatCard
          icon={ShoppingBag}
          label="Total Orders"
          value={orders.length}
          subtitle={`+${todayOrders} placed today`}
          onClick={() => setActiveTab("orders")}
        />
        <StatCard
          icon={DollarSign}
          label="Total Revenue"
          value={`₹${totalRevenue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`}
          subtitle="From confirmed orders"
          onClick={() => setActiveTab("orders")}
        />
        <StatCard
          icon={TrendingUp}
          label="Pending Orders"
          value={pendingCount}
          subtitle="Awaiting fulfillment"
          accent
          onClick={() => {
            setOrderStatusFilter("pending");
            setActiveTab("orders");
          }}
        />
      </div>

      {/* Recent Orders Preview */}
      <div className="bg-white rounded-[4px] border border-[#e8e6e1] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#e8e6e1] bg-[#FAF9F6] flex items-center justify-between">
          <div>
            <h3 className="font-serif text-xl tracking-wide text-[#1a1a1a]">Recent Orders</h3>
            <p className="text-xs text-[#8a8a8a] mt-0.5">Latest purchase requests across the store</p>
          </div>
          <button
            onClick={() => setActiveTab("orders")}
            className="text-xs font-medium text-[#1a1a1a] hover:underline underline-offset-4 transition-colors"
          >
            View all ({orders.length}) →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#f5f4f0] text-[#8a8a8a]">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Payment</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8e6e1]">
              {ordersLoading ? (
                Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} cols={6} />)
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#8a8a8a]">
                    No orders placed yet.
                  </td>
                </tr>
              ) : (
                orders.slice(0, 6).map((o) => (
                  <tr key={o.id} className="hover:bg-[#FAF9F6] transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-[#1a1a1a]">
                      #{o.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 text-[#4a4a4a]">
                      {o.full_name || <span className="text-[#8a8a8a] italic">User #{o.user_id.slice(0, 6)}</span>}
                    </td>
                    <td className="px-6 py-4 text-[#4a4a4a]">
                      {new Date(o.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {o.payment_method === "razorpay" ? (
                        <span className="px-2 py-0.5 rounded-[2px] text-[10px] font-medium uppercase bg-blue-50 text-blue-600 border border-blue-100">
                          Razorpay
                        </span>
                      ) : o.payment_method === "cod" ? (
                        <span className="px-2 py-0.5 rounded-[2px] text-[10px] font-medium uppercase bg-amber-50 text-amber-700 border border-amber-200">
                          Cash on Delivery
                        </span>
                      ) : (
                        <span className="text-[#8a8a8a] text-xs">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 text-[10px] uppercase tracking-wider border rounded-[2px] font-medium ${statusClass(
                          o.status
                        )}`}
                      >
                        {o.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-[#1a1a1a]">
                      ₹{Number(o.total_amount).toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  /* ═══════════════════════════════════════════
     PRODUCTS TAB
  ═══════════════════════════════════════════ */
  const renderProducts = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white rounded-[4px] border border-[#e8e6e1] shadow-sm overflow-hidden">
        {/* Header & Add Button */}
        <div className="p-6 border-b border-[#e8e6e1] bg-[#FAF9F6] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-xl tracking-wide text-[#1a1a1a]">Product Catalog</h3>
            <p className="text-xs text-[#8a8a8a] mt-0.5">
              Manage luxury fragrances, notes, stock counts, and prices
            </p>
          </div>
          <button
            onClick={() => {
              setEditingProduct(null);
              setModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1a1a1a] text-white rounded-[2px] hover:bg-[#333] transition-colors text-sm font-medium shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>

        {/* Filters & Search */}
        <div className="p-4 border-b border-[#e8e6e1] bg-white flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8a8a8a]" />
            <input
              type="text"
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              placeholder="Search products by name, mood, category..."
              className="w-full bg-[#f5f4f0] border border-[#e8e6e1] pl-9 pr-3 py-2 rounded-[2px] text-xs focus:outline-none focus:border-[#1a1a1a] text-[#1a1a1a]"
            />
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {(["all", "available", "coming_soon"] as const).map((st) => (
              <button
                key={st}
                onClick={() => setProductStatusFilter(st)}
                className={`px-3 py-1.5 rounded-[2px] text-xs font-medium transition-colors ${
                  productStatusFilter === st
                    ? "bg-[#1a1a1a] text-white"
                    : "bg-[#f5f4f0] text-[#4a4a4a] hover:bg-[#e8e6e1]"
                }`}
              >
                {st === "all" ? "All Products" : st === "available" ? "Available" : "Coming Soon"}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#f5f4f0] text-[#8a8a8a]">
              <tr>
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Category / Notes</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Stock</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8e6e1]">
              {productsLoading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} cols={6} />)
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#8a8a8a]">
                    No products found matching your search.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const thumb = (p.images && p.images[0]) || p.image_url;
                  const stockCls =
                    p.stock > 10
                      ? "bg-green-100 text-green-800 border-green-200"
                      : p.stock > 0
                      ? "bg-amber-100 text-amber-800 border-amber-200"
                      : "bg-red-100 text-red-800 border-red-200";

                  return (
                    <tr key={p.id} className="hover:bg-[#FAF9F6] transition-colors">
                      {/* Product Preview */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {thumb ? (
                            <img
                              src={thumb}
                              alt={p.name}
                              className="w-12 h-16 object-cover border border-[#e8e6e1] rounded-[2px] flex-shrink-0 bg-[#FAF9F6]"
                            />
                          ) : (
                            <div className="w-12 h-16 bg-[#f0eeea] border border-[#e8e6e1] flex items-center justify-center rounded-[2px] flex-shrink-0">
                              <PackageIcon className="w-5 h-5 text-[#8a8a8a]" />
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-[#1a1a1a]">{p.name}</div>
                            {p.size_ml && (
                              <div className="text-xs text-[#8a8a8a]">{p.size_ml} ml</div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Fragrance Info */}
                      <td className="px-6 py-4 whitespace-normal max-w-xs">
                        <span className="text-xs px-2 py-0.5 bg-[#f0eeea] rounded-[2px] font-medium text-[#4a4a4a]">
                          {p.category || "Fragrance"}
                        </span>
                        {p.mood && (
                          <div className="text-xs text-[#8a8a8a] mt-1 truncate">
                            Mood: {p.mood}
                          </div>
                        )}
                        {p.top_notes && (
                          <div className="text-[11px] text-[#aaa] mt-0.5 truncate">
                            Notes: {p.top_notes}
                          </div>
                        )}
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4 font-medium text-[#1a1a1a]">
                        ₹{Number(p.price).toFixed(2)}
                      </td>

                      {/* Stock */}
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 text-[11px] uppercase tracking-wider rounded-[2px] font-medium border ${stockCls}`}
                        >
                          {p.stock} in stock
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 text-[10px] uppercase tracking-wider rounded-[2px] font-medium border ${
                            p.status === "available"
                              ? "bg-green-100 text-green-800 border-green-200"
                              : "bg-yellow-100 text-yellow-800 border-yellow-200"
                          }`}
                        >
                          {p.status === "available" ? "Available" : "Coming Soon"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingProduct(p);
                              setModalOpen(true);
                            }}
                            className="p-1.5 text-[#4a4a4a] hover:bg-[#e8e6e1] hover:text-[#1a1a1a] transition-colors rounded-[2px]"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            disabled={deletingProductId === p.id}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-[2px] transition-colors disabled:opacity-40"
                            title="Delete Product"
                          >
                            {deletingProductId === p.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  /* ═══════════════════════════════════════════
     ORDERS TAB
  ═══════════════════════════════════════════ */
  const renderOrders = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white rounded-[4px] border border-[#e8e6e1] shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-[#e8e6e1] bg-[#FAF9F6]">
          <h3 className="font-serif text-xl tracking-wide text-[#1a1a1a]">Order Fulfillment</h3>
          <p className="text-xs text-[#8a8a8a] mt-0.5">
            Track customer deliveries, update order states, and verify shipment addresses
          </p>
        </div>

        {/* Search & Filter */}
        <div className="p-4 border-b border-[#e8e6e1] bg-white flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8a8a8a]" />
            <input
              type="text"
              value={orderSearch}
              onChange={(e) => setOrderSearch(e.target.value)}
              placeholder="Search by ID, name, phone, city..."
              className="w-full bg-[#f5f4f0] border border-[#e8e6e1] pl-9 pr-3 py-2 rounded-[2px] text-xs focus:outline-none focus:border-[#1a1a1a] text-[#1a1a1a]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-[#8a8a8a] whitespace-nowrap">Filter Status:</span>
            <select
              value={orderStatusFilter}
              onChange={(e) => setOrderStatusFilter(e.target.value)}
              className="bg-[#f5f4f0] border border-[#e8e6e1] px-3 py-1.5 rounded-[2px] text-xs text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a]"
            >
              <option value="all">All Statuses ({orders.length})</option>
              {ORDER_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label} ({orders.filter((o) => o.status === s.value).length})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#f5f4f0] text-[#8a8a8a]">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Customer Details</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Payment</th>
                <th className="px-6 py-4 font-medium">Status Dropdown</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8e6e1]">
              {ordersLoading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} cols={7} />)
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-[#8a8a8a]">
                    No orders found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => {
                  const isExpanded = expandedOrderId === o.id;

                  // Extract items from order_items or items_snapshot
                  const rawItems = o.order_items && o.order_items.length > 0
                    ? o.order_items.map((it) => ({
                        id: it.id,
                        name: it.products?.name || it.name || "Fragrance Item",
                        image_url: it.products?.image_url || it.image_url,
                        quantity: it.quantity,
                        price: Number(it.price) || 0,
                      }))
                    : (o.items_snapshot || []).map((it, idx) => ({
                        id: it.id || it.product_id || String(idx),
                        name: it.name || it.title || "Fragrance Item",
                        image_url: it.image_url,
                        quantity: it.quantity || 1,
                        price: Number(it.price) || 0,
                      }));

                  return (
                    <React.Fragment key={o.id}>
                      <tr className="hover:bg-[#FAF9F6] transition-colors">
                        {/* ID */}
                        <td className="px-6 py-4 font-mono font-medium text-[#1a1a1a]">
                          #{o.id.slice(0, 8).toUpperCase()}
                        </td>

                        {/* Customer */}
                        <td className="px-6 py-4">
                          <div className="font-medium text-[#1a1a1a]">
                            {o.full_name || "Guest Customer"}
                          </div>
                          {o.phone_number && (
                            <div className="text-xs text-[#8a8a8a]">{o.phone_number}</div>
                          )}
                          {o.city && (
                            <div className="text-xs text-[#8a8a8a]">
                              {o.city}{o.state ? `, ${o.state}` : ""}
                            </div>
                          )}
                        </td>

                        {/* Amount */}
                        <td className="px-6 py-4 font-medium text-[#1a1a1a]">
                          ₹{Number(o.total_amount).toFixed(2)}
                        </td>

                        {/* Payment */}
                        <td className="px-6 py-4">
                          {o.payment_method === "razorpay" ? (
                            <span className="px-2 py-0.5 rounded-[2px] text-[10px] font-medium uppercase bg-blue-50 text-blue-600 border border-blue-100">
                              Online (Razorpay)
                            </span>
                          ) : o.payment_method === "cod" ? (
                            <span className="px-2 py-0.5 rounded-[2px] text-[10px] font-medium uppercase bg-amber-50 text-amber-700 border border-amber-200">
                              Cash on Delivery
                            </span>
                          ) : (
                            <span className="text-[#8a8a8a]">—</span>
                          )}
                        </td>

                        {/* Status Select */}
                        <td className="px-6 py-4">
                          <select
                            value={o.status}
                            onChange={(e) => handleStatusChange(o.id, e.target.value)}
                            disabled={updatingOrderId === o.id}
                            className={`rounded-[2px] border px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide outline-none cursor-pointer disabled:opacity-60 transition-colors ${statusClass(
                              o.status
                            )}`}
                          >
                            {ORDER_STATUSES.map((s) => (
                              <option key={s.value} value={s.value}>
                                {s.label}
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* Date */}
                        <td className="px-6 py-4 text-[#4a4a4a] text-xs">
                          {new Date(o.created_at).toLocaleString()}
                        </td>

                        {/* Details Toggle */}
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setExpandedOrderId(isExpanded ? null : o.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-[#4a4a4a] hover:bg-[#e8e6e1] rounded-[2px] transition-colors"
                          >
                            <span>{isExpanded ? "Hide" : "View"}</span>
                            <ChevronDown
                              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                        </td>
                      </tr>

                      {/* Expandable Order Details Row */}
                      {isExpanded && (
                        <tr className="bg-[#FAF9F6]">
                          <td colSpan={7} className="px-6 py-4">
                            <div className="bg-white border border-[#e8e6e1] rounded-[3px] p-5 shadow-sm space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-3 border-b border-[#e8e6e1]">
                                {/* Delivery Address Card */}
                                <div>
                                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8a8a8a] mb-2">
                                    Shipping & Delivery Address
                                  </h4>
                                  <p className="text-sm font-medium text-[#1a1a1a]">
                                    {o.full_name || "Customer"}
                                  </p>
                                  {o.phone_number && (
                                    <p className="text-xs text-[#4a4a4a] mt-0.5">Phone: {o.phone_number}</p>
                                  )}
                                  <p className="text-xs text-[#4a4a4a] mt-1">
                                    {o.address_line1 || o.shipping_address || "No address specified"}
                                  </p>
                                  {o.address_line2 && (
                                    <p className="text-xs text-[#4a4a4a]">{o.address_line2}</p>
                                  )}
                                  {(o.city || o.state || o.pincode) && (
                                    <p className="text-xs text-[#4a4a4a] font-medium mt-0.5">
                                      {[o.city, o.state, o.pincode].filter(Boolean).join(", ")}
                                    </p>
                                  )}
                                </div>

                                {/* Payment & Transaction Card */}
                                <div>
                                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8a8a8a] mb-2">
                                    Payment Information
                                  </h4>
                                  <p className="text-xs text-[#4a4a4a]">
                                    Method:{" "}
                                    <span className="font-semibold text-[#1a1a1a] uppercase">
                                      {o.payment_method || "N/A"}
                                    </span>
                                  </p>
                                  {o.razorpay_payment_id && (
                                    <p className="text-xs text-[#4a4a4a] mt-0.5 font-mono">
                                      Payment ID: {o.razorpay_payment_id}
                                    </p>
                                  )}
                                  <p className="text-xs text-[#4a4a4a] mt-1">
                                    Current Status:{" "}
                                    <span className="font-semibold capitalize text-[#1a1a1a]">
                                      {o.status.replace("_", " ")}
                                    </span>
                                  </p>
                                </div>
                              </div>

                              {/* Order Items Table */}
                              <div>
                                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8a8a8a] mb-2">
                                  Purchased Items
                                </h4>
                                {rawItems.length === 0 ? (
                                  <p className="text-xs text-[#8a8a8a] italic">No item breakdown available.</p>
                                ) : (
                                  <div className="border border-[#e8e6e1] rounded-[2px] overflow-hidden">
                                    <table className="w-full text-xs">
                                      <thead className="bg-[#f5f4f0] text-[#8a8a8a]">
                                        <tr>
                                          <th className="px-4 py-2.5 text-left font-medium">Product</th>
                                          <th className="px-4 py-2.5 text-center font-medium">Qty</th>
                                          <th className="px-4 py-2.5 text-right font-medium">Unit Price</th>
                                          <th className="px-4 py-2.5 text-right font-medium">Subtotal</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-[#e8e6e1]">
                                        {rawItems.map((item, idx) => (
                                          <tr key={`${item.id}-${idx}`}>
                                            <td className="px-4 py-2.5 flex items-center gap-3">
                                              {item.image_url ? (
                                                <img
                                                  src={item.image_url}
                                                  alt=""
                                                  className="w-8 h-10 object-cover border border-[#e8e6e1] rounded-[1px]"
                                                />
                                              ) : (
                                                <div className="w-8 h-10 bg-[#f0eeea] border border-[#e8e6e1] flex items-center justify-center rounded-[1px]">
                                                  <PackageIcon className="w-3.5 h-3.5 text-[#8a8a8a]" />
                                                </div>
                                              )}
                                              <span className="font-medium text-[#1a1a1a]">
                                                {item.name}
                                              </span>
                                            </td>
                                            <td className="px-4 py-2.5 text-center text-[#4a4a4a]">
                                              {item.quantity}
                                            </td>
                                            <td className="px-4 py-2.5 text-right text-[#4a4a4a]">
                                              ₹{item.price.toFixed(2)}
                                            </td>
                                            <td className="px-4 py-2.5 text-right font-semibold text-[#1a1a1a]">
                                              ₹{(item.price * item.quantity).toFixed(2)}
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  /* ═══════════════════════════════════════════
     REVIEWS TAB
  ═══════════════════════════════════════════ */
  const renderReviews = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white rounded-[4px] border border-[#e8e6e1] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#e8e6e1] bg-[#FAF9F6]">
          <h3 className="font-serif text-xl tracking-wide text-[#1a1a1a]">Customer Reviews</h3>
          <p className="text-xs text-[#8a8a8a] mt-0.5">
            Moderate verified fragrance ratings and feedback
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#f5f4f0] text-[#8a8a8a]">
              <tr>
                <th className="px-6 py-4 font-medium min-w-[200px]">Product / User</th>
                <th className="px-6 py-4 font-medium w-full">Rating & Feedback</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8e6e1] whitespace-normal">
              {reviewsLoading ? (
                Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} cols={3} />)
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-[#8a8a8a]">
                    No customer reviews submitted yet.
                  </td>
                </tr>
              ) : (
                reviews.map((r) => (
                  <tr key={r.id} className="hover:bg-[#FAF9F6] transition-colors">
                    <td className="px-6 py-4 align-top">
                      <div className="font-medium text-[#1a1a1a]">
                        {r.products?.name || "WearAura Fragrance"}
                      </div>
                      <div className="text-xs text-[#8a8a8a] mt-0.5">User ID: {r.user_id.slice(0, 8)}…</div>
                      <div className="text-xs text-[#8a8a8a]">{new Date(r.created_at).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="flex text-amber-400 mb-1.5 text-sm gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-4 h-4 ${
                              s <= r.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-[#4a4a4a] text-sm">
                        {r.comment || <span className="italic text-[#8a8a8a]">No written comment</span>}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right align-top whitespace-nowrap">
                      <button
                        onClick={() => handleDeleteReview(r.id)}
                        disabled={deletingReviewId === r.id}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-[2px] transition-colors disabled:opacity-40"
                        title="Delete review"
                      >
                        {deletingReviewId === r.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  /* ═══════════════════════════════════════════
     LAYOUT & RENDER
  ═══════════════════════════════════════════ */
  return (
    <div className="flex h-screen bg-[#FAF9F6] text-[#1a1a1a] pt-[64px] md:pt-[80px]">
      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition duration-300 ease-in-out z-40 w-64 bg-[#1a1a1a] text-[#FAF9F6] border-r border-[#2a2a2a] pt-[64px] md:pt-0 flex flex-col shadow-2xl md:shadow-none`}
      >
        {/* Brand Header */}
        <div className="p-6 hidden md:block border-b border-[#2a2a2a]">
          <h2 className="text-lg font-serif tracking-[0.2em] text-[#FAF9F6]">WEARAURA</h2>
          <p className="text-[10px] text-[#888] uppercase tracking-widest mt-0.5">Admin Management Suite</p>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 mt-4 px-3 space-y-1.5">
          {NAV.map(({ id, label, icon: Icon, count }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => {
                  setActiveTab(id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-[2px] text-sm font-medium transition-all ${
                  active
                    ? "bg-[#2d1b3d] text-white border-l-2 border-[#c4a8d4]"
                    : "text-[#888] hover:text-white hover:bg-[#2a2a2a]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{label}</span>
                </div>
                {count !== undefined && count > 0 && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] rounded-[2px] ${
                      active ? "bg-white/20 text-white" : "bg-[#2a2a2a] text-[#aaa]"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Links: Storefront & Logout */}
        <div className="p-4 border-t border-[#2a2a2a] space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-3 py-2 text-xs text-[#aaa] hover:text-white hover:bg-[#2a2a2a] rounded-[2px] transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Storefront</span>
          </Link>
          <button
            onClick={() => signOut()}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-[2px] transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile Header Bar */}
        <header className="bg-white border-b border-[#e8e6e1] px-5 py-3.5 flex items-center justify-between md:hidden shadow-sm z-20">
          <div>
            <h2 className="text-base font-serif text-[#1a1a1a]">WearAura Admin</h2>
            <p className="text-[10px] text-[#8a8a8a] capitalize">{activeTab}</p>
          </div>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-[#1a1a1a] bg-[#f0eeea] rounded-[2px]"
          >
            <Menu className="w-5 h-5" />
          </button>
        </header>

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto px-5 py-6 lg:px-8 lg:py-8 bg-[#FAF9F6]">
          <div className="max-w-[1400px] mx-auto">
            {activeTab === "dashboard" && renderDashboard()}
            {activeTab === "orders"    && renderOrders()}
            {activeTab === "products"  && renderProducts()}
            {activeTab === "reviews"   && renderReviews()}
            {activeTab === "hero"      && <HeroManagement />}
          </div>
        </main>
      </div>

      {/* Product Modal */}
      <AnimatePresence>
        {modalOpen && (
          <ProductModal
            key="product-modal"
            product={editingProduct}
            onClose={() => setModalOpen(false)}
            onSaved={fetchProducts}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
