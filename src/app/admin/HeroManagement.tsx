"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import toast from "react-hot-toast";
import {
  Image as ImageIcon,
  Trash2,
  Edit2,
  Upload,
  X,
  Plus,
  ArrowUp,
  ArrowDown,
  Loader2,
  ExternalLink,
  Check,
} from "lucide-react";

export interface HeroImage {
  id: string;
  image_url: string;
  title: string | null;
  subtitle: string | null;
  button_text: string | null;
  button_link: string | null;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
}

export default function HeroManagement() {
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reorderingId, setReorderingId] = useState<string | null>(null);

  // Add/Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<{
    image_url: string;
    title: string;
    subtitle: string;
    button_text: string;
    button_link: string;
    sort_order: string;
    is_active: boolean;
  }>({
    image_url: "",
    title: "",
    subtitle: "",
    button_text: "",
    button_link: "",
    sort_order: "0",
    is_active: true,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const fetchHeroImages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("hero_images")
      .select("*")
      .order("sort_order", { ascending: true });
    if (!error && data) {
      setHeroImages(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHeroImages();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let finalUrl = form.image_url.trim();

      // If user provided a local file, read as Data URL
      if (imageFile) {
        finalUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => resolve(event.target?.result as string);
          reader.onerror = () => reject(new Error("Failed to read image file"));
          reader.readAsDataURL(imageFile);
        });
      }

      if (!finalUrl) {
        toast.error("Image URL or file is required");
        setIsSubmitting(false);
        return;
      }

      const payload = {
        image_url: finalUrl,
        title: form.title.trim() || null,
        subtitle: form.subtitle.trim() || null,
        button_text: form.button_text.trim() || null,
        button_link: form.button_link.trim() || null,
        sort_order: parseInt(form.sort_order, 10) || 0,
        is_active: form.is_active,
      };

      if (editingId && editingId !== "new") {
        const { error } = await supabase
          .from("hero_images")
          .update(payload)
          .eq("id", editingId);
        if (error) throw error;
        toast.success("Hero slide updated");
      } else {
        const { error } = await supabase.from("hero_images").insert([payload]);
        if (error) throw error;
        toast.success("Hero slide added");
      }

      setEditingId(null);
      setImageFile(null);
      setImagePreview(null);
      fetchHeroImages();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Error saving slide");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this hero slide?")) return;
    try {
      const { error } = await supabase.from("hero_images").delete().eq("id", id);
      if (error) throw error;
      toast.success("Hero slide deleted");
      fetchHeroImages();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Error deleting slide");
    }
  };

  const handleEditClick = (image: HeroImage) => {
    setEditingId(image.id);
    setForm({
      image_url: image.image_url,
      title: image.title || "",
      subtitle: image.subtitle || "",
      button_text: image.button_text || "",
      button_link: image.button_link || "",
      sort_order: (image.sort_order || 0).toString(),
      is_active: image.is_active !== false,
    });
    setImageFile(null);
    setImagePreview(null);
  };

  const handleAddNew = () => {
    setEditingId("new");
    setForm({
      image_url: "",
      title: "",
      subtitle: "",
      button_text: "",
      button_link: "",
      sort_order: (heroImages.length + 1).toString(),
      is_active: true,
    });
    setImageFile(null);
    setImagePreview(null);
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= heroImages.length) return;

    const currentImg = heroImages[index];
    const targetImg = heroImages[targetIndex];

    setReorderingId(currentImg.id);
    try {
      // Swap sort_order values
      const currentSort = currentImg.sort_order;
      const targetSort = targetImg.sort_order;

      const newCurrentSort = targetSort === currentSort ? (direction === "up" ? targetSort - 1 : targetSort + 1) : targetSort;
      const newTargetSort = currentSort;

      await Promise.all([
        supabase.from("hero_images").update({ sort_order: newCurrentSort }).eq("id", currentImg.id),
        supabase.from("hero_images").update({ sort_order: newTargetSort }).eq("id", targetImg.id),
      ]);

      toast.success("Order updated");
      await fetchHeroImages();
    } catch {
      toast.error("Failed to reorder");
    } finally {
      setReorderingId(null);
    }
  };

  const handleToggleActive = async (image: HeroImage) => {
    try {
      const nextActive = !image.is_active;
      const { error } = await supabase
        .from("hero_images")
        .update({ is_active: nextActive })
        .eq("id", image.id);
      if (error) throw error;
      setHeroImages((prev) =>
        prev.map((img) => (img.id === image.id ? { ...img, is_active: nextActive } : img))
      );
      toast.success(`Slide ${nextActive ? "activated" : "deactivated"}`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Add / Edit Slide Form */}
      {editingId && (
        <div className="bg-white rounded-[4px] border border-[#e8e6e1] shadow-sm overflow-hidden mb-8">
          <div className="p-6 border-b border-[#e8e6e1] bg-[#FAF9F6] flex justify-between items-center">
            <div>
              <h3 className="font-serif text-xl tracking-wide text-[#1a1a1a]">
                {editingId === "new" ? "Add Hero Slide" : "Edit Hero Slide"}
              </h3>
              <p className="text-xs text-[#8a8a8a] mt-0.5">
                Configure carousel background image and promotional copy
              </p>
            </div>
            <button
              onClick={() => setEditingId(null)}
              className="text-[#8a8a8a] hover:text-[#1a1a1a] p-1.5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#4a4a4a] uppercase tracking-wider">
                  Title (Optional)
                </label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-[#f5f4f0] border border-[#e8e6e1] px-3.5 py-2.5 rounded-[2px] focus:outline-none focus:border-[#1a1a1a] text-sm text-[#1a1a1a] transition-colors"
                  placeholder="e.g. New Summer Luxury Collection"
                />
              </div>

              {/* Subtitle */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#4a4a4a] uppercase tracking-wider">
                  Subtitle (Optional)
                </label>
                <input
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  className="w-full bg-[#f5f4f0] border border-[#e8e6e1] px-3.5 py-2.5 rounded-[2px] focus:outline-none focus:border-[#1a1a1a] text-sm text-[#1a1a1a] transition-colors"
                  placeholder="e.g. Discover the essence of refined elegance."
                />
              </div>

              {/* Button Text */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#4a4a4a] uppercase tracking-wider">
                  Button Text (Optional)
                </label>
                <input
                  value={form.button_text}
                  onChange={(e) => setForm({ ...form, button_text: e.target.value })}
                  className="w-full bg-[#f5f4f0] border border-[#e8e6e1] px-3.5 py-2.5 rounded-[2px] focus:outline-none focus:border-[#1a1a1a] text-sm text-[#1a1a1a] transition-colors"
                  placeholder="e.g. Explore Collection"
                />
              </div>

              {/* Button Link */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#4a4a4a] uppercase tracking-wider">
                  Button Link (Optional)
                </label>
                <input
                  value={form.button_link}
                  onChange={(e) => setForm({ ...form, button_link: e.target.value })}
                  className="w-full bg-[#f5f4f0] border border-[#e8e6e1] px-3.5 py-2.5 rounded-[2px] focus:outline-none focus:border-[#1a1a1a] text-sm text-[#1a1a1a] transition-colors"
                  placeholder="e.g. /collection"
                />
              </div>

              {/* Sort Order */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#4a4a4a] uppercase tracking-wider">
                  Display Order
                </label>
                <input
                  type="number"
                  required
                  value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
                  className="w-full bg-[#f5f4f0] border border-[#e8e6e1] px-3.5 py-2.5 rounded-[2px] focus:outline-none focus:border-[#1a1a1a] text-sm text-[#1a1a1a] transition-colors"
                />
              </div>

              {/* Active Toggle */}
              <div className="space-y-1.5 flex items-center pt-6">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                    className="w-4 h-4 accent-[#1a1a1a] rounded cursor-pointer"
                  />
                  <span className="text-sm font-medium text-[#1a1a1a]">
                    Active (Show in Homepage carousel)
                  </span>
                </label>
              </div>

              {/* Image Input Options */}
              <div className="md:col-span-2 space-y-3 pt-2">
                <label className="text-xs font-semibold text-[#4a4a4a] uppercase tracking-wider block">
                  Slide Image <span className="text-red-500">*</span>
                </label>

                {/* Option A: Image URL */}
                <div className="space-y-1.5">
                  <span className="text-xs text-[#8a8a8a]">Paste Image URL or select a local image file:</span>
                  <input
                    type="url"
                    value={form.image_url}
                    onChange={(e) => {
                      setForm({ ...form, image_url: e.target.value });
                      setImagePreview(null);
                      setImageFile(null);
                    }}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-[#f5f4f0] border border-[#e8e6e1] px-3.5 py-2 rounded-[2px] focus:outline-none focus:border-[#1a1a1a] text-sm text-[#1a1a1a] transition-colors"
                  />
                </div>

                {/* Option B: File Upload & Preview */}
                <div className="flex items-center gap-4 pt-1">
                  {imagePreview || form.image_url ? (
                    <div className="relative w-36 h-20 border border-[#e8e6e1] rounded-[2px] overflow-hidden bg-[#FAF9F6] flex-shrink-0 group">
                      <img
                        src={imagePreview || form.image_url}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                          setForm({ ...form, image_url: "" });
                        }}
                        className="absolute top-1 right-1 bg-black/70 hover:bg-black text-white rounded-full p-1 opacity-80 hover:opacity-100 transition-opacity"
                        title="Remove image"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-36 h-20 bg-[#f0eeea] border border-[#e8e6e1] border-dashed flex flex-col items-center justify-center rounded-[2px] flex-shrink-0 text-[#8a8a8a]">
                      <ImageIcon className="w-6 h-6 mb-1" />
                      <span className="text-[10px]">No image</span>
                    </div>
                  )}

                  <label className="flex items-center gap-2 px-4 py-2 border border-[#e8e6e1] rounded-[2px] text-xs font-medium text-[#4a4a4a] hover:bg-[#f5f4f0] cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Choose File from Device</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-[#e8e6e1] pt-6">
              <button
                type="button"
                onClick={() => setEditingId(null)}
                className="px-5 py-2.5 border border-[#e8e6e1] text-[#4a4a4a] hover:bg-[#e8e6e1] rounded-[2px] text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#1a1a1a] text-white rounded-[2px] hover:bg-[#333] transition-colors text-sm font-medium disabled:opacity-60"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSubmitting ? "Saving..." : editingId === "new" ? "Add Slide" : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Hero Slides Table */}
      <div className="bg-white rounded-[4px] border border-[#e8e6e1] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#e8e6e1] bg-[#FAF9F6] flex justify-between items-center">
          <div>
            <h3 className="font-serif text-xl tracking-wide text-[#1a1a1a]">Hero Slides Carousel</h3>
            <p className="text-xs text-[#8a8a8a] mt-0.5">
              Manage slides shown in the homepage hero section. Reorder or toggle visibility.
            </p>
          </div>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white rounded-[2px] hover:bg-[#333] transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" /> Add Slide
          </button>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-[#8a8a8a]">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#1a1a1a]" />
              <p className="text-sm">Loading slides...</p>
            </div>
          ) : heroImages.length === 0 ? (
            <div className="p-12 text-center text-[#8a8a8a]">
              <ImageIcon className="w-8 h-8 mx-auto mb-2 text-[#b0aea8]" />
              <p className="text-sm font-medium text-[#1a1a1a]">No hero slides found</p>
              <p className="text-xs mt-1">Click "Add Slide" above to add your first homepage slide.</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#f5f4f0] text-[#8a8a8a]">
                <tr>
                  <th className="px-6 py-4 font-medium min-w-[140px]">Preview</th>
                  <th className="px-6 py-4 font-medium w-full">Content & Copy</th>
                  <th className="px-6 py-4 font-medium text-center">Status</th>
                  <th className="px-6 py-4 font-medium text-center">Order</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e8e6e1]">
                {heroImages.map((img, index) => (
                  <tr key={img.id} className="hover:bg-[#FAF9F6] transition-colors">
                    {/* Thumbnail preview */}
                    <td className="px-6 py-4">
                      <div className="w-28 h-16 border border-[#e8e6e1] rounded-[2px] overflow-hidden bg-[#FAF9F6]">
                        <img
                          src={img.image_url}
                          alt={img.title || "Slide"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>

                    {/* Content */}
                    <td className="px-6 py-4 whitespace-normal">
                      <div className="font-medium text-[#1a1a1a]">
                        {img.title || <span className="text-[#8a8a8a] italic">No title</span>}
                      </div>
                      <div className="text-xs text-[#666] truncate max-w-[360px] mt-0.5">
                        {img.subtitle || <span className="text-[#aaa] italic">No subtitle</span>}
                      </div>
                      {img.button_text && (
                        <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 bg-[#1a1a1a] text-white text-[10px] uppercase tracking-wider rounded-[2px]">
                          <span>{img.button_text}</span>
                          <span className="text-[9px] opacity-70">({img.button_link || "/"})</span>
                        </div>
                      )}
                    </td>

                    {/* Active toggle */}
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleActive(img)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] uppercase tracking-wider rounded-[2px] font-medium border transition-colors ${
                          img.is_active
                            ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-200"
                            : "bg-[#f0eeea] text-[#8a8a8a] border-[#e8e6e1] hover:bg-[#e4e2dd]"
                        }`}
                      >
                        {img.is_active && <Check className="w-3 h-3" />}
                        {img.is_active ? "Active" : "Inactive"}
                      </button>
                    </td>

                    {/* Sort Order and Reorder Buttons */}
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleMove(index, "up")}
                          disabled={index === 0 || reorderingId === img.id}
                          className="p-1 text-[#4a4a4a] hover:bg-[#e8e6e1] rounded-[2px] disabled:opacity-20 transition-colors"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-mono text-xs text-[#1a1a1a] font-medium w-6 text-center">
                          {img.sort_order}
                        </span>
                        <button
                          onClick={() => handleMove(index, "down")}
                          disabled={index === heroImages.length - 1 || reorderingId === img.id}
                          className="p-1 text-[#4a4a4a] hover:bg-[#e8e6e1] rounded-[2px] disabled:opacity-20 transition-colors"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEditClick(img)}
                          className="p-1.5 text-[#4a4a4a] hover:bg-[#e8e6e1] hover:text-[#1a1a1a] transition-colors rounded-[2px]"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(img.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-[2px] transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
