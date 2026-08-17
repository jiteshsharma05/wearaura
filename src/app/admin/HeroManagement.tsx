import React, { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { uploadImageToCloudinary } from "@/components/utils/cloudinaryUpload";
import toast from "react-hot-toast";
import { Image as ImageIcon, Trash2, Edit2, Upload, X, Plus } from "lucide-react";

export interface HeroImage {
    id: string;
    image_url: string;
    title: string | null;
    subtitle: string | null;
    button_text: string | null;
    button_link: string | null;
    sort_order: number;
    is_active: boolean;
}

export default function HeroManagement() {
    const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
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
        image_url: '', title: '', subtitle: '', button_text: '', button_link: '', sort_order: '0', is_active: true
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
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            let finalUrl = form.image_url;
            if (imageFile) {
                finalUrl = await uploadImageToCloudinary(imageFile);
            }

            if (!finalUrl) {
                toast.error("Image is required");
                setIsSubmitting(false);
                return;
            }

            const payload = {
                image_url: finalUrl,
                title: form.title || null,
                subtitle: form.subtitle || null,
                button_text: form.button_text || null,
                button_link: form.button_link || null,
                sort_order: parseInt(form.sort_order, 10),
                is_active: form.is_active
            };

            if (editingId && editingId !== 'new') {
                const { error } = await supabase.from('hero_images').update(payload).eq('id', editingId);
                if (error) throw error;
                toast.success('Slide updated');
            } else {
                const { error } = await supabase.from('hero_images').insert([payload]);
                if (error) throw error;
                toast.success('Slide added');
            }

            setEditingId(null);
            fetchHeroImages();
        } catch (error: any) {
            toast.error(error.message || 'Error saving slide');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Delete this slide?")) return;
        try {
            const { error } = await supabase.from('hero_images').delete().eq('id', id);
            if (error) throw error;
            toast.success('Slide deleted');
            fetchHeroImages();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleEditClick = (image: HeroImage) => {
        setEditingId(image.id);
        setForm({
            image_url: image.image_url,
            title: image.title || '',
            subtitle: image.subtitle || '',
            button_text: image.button_text || '',
            button_link: image.button_link || '',
            sort_order: (image.sort_order || 0).toString(),
            is_active: image.is_active !== false
        });
        setImageFile(null);
        setImagePreview(null);
    };

    const handleAddNew = () => {
        setEditingId('new');
        setForm({
            image_url: '', title: '', subtitle: '', button_text: '', button_link: '', sort_order: (heroImages.length + 1).toString(), is_active: true
        });
        setImageFile(null);
        setImagePreview(null);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {editingId && (
                <div className="bg-white rounded-[4px] border border-[#e8e6e1] shadow-sm overflow-hidden mb-8">
                    <div className="p-6 border-b border-[#e8e6e1] bg-[#FAF9F6] flex justify-between items-center">
                        <h3 className="font-serif text-xl tracking-wide text-[#1a1a1a]">{editingId === 'new' ? 'Add New Slide' : 'Edit Slide'}</h3>
                        <button onClick={() => setEditingId(null)} className="text-[#8a8a8a] hover:text-[#1a1a1a]"><X className="w-5 h-5" /></button>
                    </div>
                    <form onSubmit={handleSave} className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[#1a1a1a]">Title (Optional)</label>
                                <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full bg-[#f0eeea] border border-[#e8e6e1] px-4 py-2 rounded-[2px] focus:outline-none focus:border-[#1a1a1a] text-[#1a1a1a]" placeholder="e.g. New Summer Luxury Collection" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[#1a1a1a]">Subtitle (Optional)</label>
                                <input value={form.subtitle} onChange={e => setForm({...form, subtitle: e.target.value})} className="w-full bg-[#f0eeea] border border-[#e8e6e1] px-4 py-2 rounded-[2px] focus:outline-none focus:border-[#1a1a1a] text-[#1a1a1a]" placeholder="e.g. Discover the essence of elegance." />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[#1a1a1a]">Button Text (Optional)</label>
                                <input value={form.button_text} onChange={e => setForm({...form, button_text: e.target.value})} className="w-full bg-[#f0eeea] border border-[#e8e6e1] px-4 py-2 rounded-[2px] focus:outline-none focus:border-[#1a1a1a] text-[#1a1a1a]" placeholder="e.g. Shop Now" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[#1a1a1a]">Button Link (Optional)</label>
                                <input value={form.button_link} onChange={e => setForm({...form, button_link: e.target.value})} className="w-full bg-[#f0eeea] border border-[#e8e6e1] px-4 py-2 rounded-[2px] focus:outline-none focus:border-[#1a1a1a] text-[#1a1a1a]" placeholder="e.g. /category/summer" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[#1a1a1a]">Sort Order</label>
                                <input type="number" required value={form.sort_order} onChange={e => setForm({...form, sort_order: e.target.value})} className="w-full bg-[#f0eeea] border border-[#e8e6e1] px-4 py-2 rounded-[2px] focus:outline-none focus:border-[#1a1a1a] text-[#1a1a1a]" />
                            </div>
                            <div className="space-y-2 flex items-center pt-8">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} className="w-4 h-4 text-[#1a1a1a] border-[#e8e6e1] rounded-[2px] focus:ring-[#1a1a1a]" />
                                    <span className="text-sm font-medium text-[#1a1a1a]">Active (Show on homepage)</span>
                                </label>
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-sm font-medium text-[#1a1a1a]">Slide Image *</label>
                                <div className="flex items-center gap-4">
                                    {imagePreview || form.image_url ? (
                                        <div className="relative w-32 h-20 border border-[#e8e6e1] rounded-[2px] overflow-hidden">
                                            <img src={imagePreview || form.image_url} className="w-full h-full object-cover" />
                                            {imagePreview && (
                                                <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); }} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1"><X className="w-3 h-3" /></button>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="w-32 h-20 bg-[#f0eeea] border border-[#e8e6e1] border-dashed flex items-center justify-center rounded-[2px]">
                                            <ImageIcon className="w-6 h-6 text-[#8a8a8a]" />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <input type="file" accept="image/*" onChange={handleImageChange} className="block w-full text-sm text-[#4a4a4a] file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded-[2px] file:bg-[#e8e6e1] file:text-[#1a1a1a] hover:file:bg-[#d4d2cc] cursor-pointer" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end border-t border-[#e8e6e1] pt-6">
                            <button disabled={isSubmitting} className="px-6 py-2.5 bg-[#1a1a1a] text-white rounded-[2px] hover:bg-[#333] transition-colors font-medium">
                                {isSubmitting ? 'Saving...' : 'Save Slide'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-[4px] border border-[#e8e6e1] shadow-sm overflow-hidden">
                <div className="p-6 border-b border-[#e8e6e1] bg-[#FAF9F6] flex justify-between items-center">
                    <h3 className="font-serif text-xl tracking-wide text-[#1a1a1a]">Hero Slides Management</h3>
                    <button onClick={handleAddNew} className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white rounded-[2px] hover:bg-[#333] transition-colors text-sm font-medium">
                        <Plus className="w-4 h-4" /> Add Slide
                    </button>
                </div>
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-8 text-center text-[#8a8a8a]">Loading slides...</div>
                    ) : heroImages.length === 0 ? (
                        <div className="p-8 text-center text-[#8a8a8a]">No hero slides found. Add one above.</div>
                    ) : (
                        <table className="w-full text-left text-sm">
                            <thead className="bg-[#f0eeea] text-[#8a8a8a]">
                                <tr>
                                    <th className="px-6 py-4 font-medium min-w-[120px]">Image</th>
                                    <th className="px-6 py-4 font-medium w-full">Content</th>
                                    <th className="px-6 py-4 font-medium text-center">Status</th>
                                    <th className="px-6 py-4 font-medium text-center">Sort</th>
                                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#e8e6e1]">
                                {heroImages.map((img) => (
                                    <tr key={img.id} className="hover:bg-[#f0eeea]/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="w-24 h-16 border border-[#e8e6e1] rounded-[2px] overflow-hidden bg-[#FAF9F6]">
                                                <img src={img.image_url} alt="Slide" className="w-full h-full object-cover" />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-[#1a1a1a]">{img.title || <span className="text-[#8a8a8a] italic">No title</span>}</div>
                                            <div className="text-xs text-[#8a8a8a] truncate max-w-[300px] mt-1">{img.subtitle || 'No subtitle'}</div>
                                            {(img.button_text) && (
                                                <div className="mt-2 inline-block px-2 py-1 bg-[#1a1a1a] text-white text-[10px] rounded uppercase tracking-wider">
                                                    {img.button_text} &rarr;
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-2 py-1 text-[11px] uppercase tracking-wider rounded-[2px] ${img.is_active ? 'bg-green-100 text-green-800' : 'bg-[#e8e6e1] text-[#8a8a8a]'}`}>
                                                {img.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center font-medium">{img.sort_order}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => handleEditClick(img)} className="p-1.5 text-[#4a4a4a] hover:bg-[#e8e6e1] hover:text-[#1a1a1a] transition-colors rounded-[2px]"><Edit2 className="w-4 h-4" /></button>
                                                <button onClick={() => handleDelete(img.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-[2px] transition-colors"><Trash2 className="w-4 h-4" /></button>
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
