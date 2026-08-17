import re

def modify_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Add imports
    content = content.replace(
        'import toast from "react-hot-toast";',
        'import toast from "react-hot-toast";\nimport { uploadImageToCloudinary } from "@/components/utils/cloudinaryUpload";\nimport { Upload, X, Image as ImageIcon } from "lucide-react";'
    )

    # 2. Add states for purchase and image upload
    state_injection = """    const [showReviewForm, setShowReviewForm] = useState(false);

    // Purchase & Image State
    const [hasPurchased, setHasPurchased] = useState(false);
    const [reviewImageFile, setReviewImageFile] = useState<File | null>(null);
    const [reviewImagePreview, setReviewImagePreview] = useState<string | null>(null);"""
    
    content = content.replace("    const [showReviewForm, setShowReviewForm] = useState(false);", state_injection)

    # 3. Add order checks inside fetchProductAndReviews
    order_check = """
            // Fetch Wishlist Status
            if (user) {
                const { data: wishlistData } = await supabase
                    .from("wishlist")
                    .select("id")
                    .eq("product_id", id)
                    .eq("user_id", user.id)
                    .single();

                if (wishlistData) setIsInWishlist(true);

                // Verify Purchase
                const { data: orderItems } = await supabase
                    .from("order_items")
                    .select("id, orders!inner(user_id)")
                    .eq("product_id", id)
                    .eq("orders.user_id", user.id)
                    .limit(1);
                    
                if (orderItems && orderItems.length > 0) {
                    setHasPurchased(true);
                }
            }"""
    content = re.sub(r'// Fetch Wishlist Status[\s\S]*?if \(wishlistData\) setIsInWishlist\(true\);\s*\}', order_check, content)

    # 4. Modify handleSubmitReview to upload image
    submit_logic = """
        try {
            let finalImageUrl = submitReviewData.image_url || null;
            if (reviewImageFile) {
                const uploadedUrl = await uploadImageToCloudinary(reviewImageFile);
                if (uploadedUrl) finalImageUrl = uploadedUrl;
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

            // Optimistically add to list
            if (data && data.length > 0) {
                setReviews([data[0], ...reviews]);
                setSubmitReviewData({ rating: 5, comment: '', image_url: '' });
                setReviewImageFile(null);
                setReviewImagePreview(null);
                setShowReviewForm(false);
                toast.success("Review submitted!");
            }
        }"""
    content = re.sub(r'try \{[\s\S]*?setShowReviewForm\(false\);\s*\}\s*\}', submit_logic, content)

    # 5. Image Change Handler
    image_handler = """
    const handleReviewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setReviewImageFile(file);
            setReviewImagePreview(URL.createObjectURL(file));
        }
    };

    const handleToggleWishlist = async () => {"""
    content = content.replace("    const handleToggleWishlist = async () => {", image_handler)

    # 6. Update the UI for showing the button
    review_button = """
                        {hasPurchased ? (
                            <button
                                onClick={() => {
                                    if (!user) router.push('/login');
                                    else setShowReviewForm(!showReviewForm);
                                }}
                                className="inline-flex items-center justify-center rounded-[2px] border border-zinc-300 dark:border-zinc-700 bg-transparent px-6 py-2.5 text-sm font-medium text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                            >
                                Write a Review
                            </button>
                        ) : (
                            <div className="text-sm text-zinc-500 italic">You must purchase this product to leave a review.</div>
                        )}"""
    content = re.sub(r'<button[\s\S]*?Write a Review\s*</button>', review_button, content)

    # 7. Update Review Form inputs (replace manual url input with Cloudinary upload)
    form_image = """
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Photo (Optional)</label>
                                    <div className="flex items-center gap-4">
                                        {reviewImagePreview ? (
                                            <div className="relative w-24 h-24 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
                                                <img src={reviewImagePreview} className="w-full h-full object-cover" />
                                                <button type="button" onClick={() => { setReviewImageFile(null); setReviewImagePreview(null); }} className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"><X className="w-3 h-3" /></button>
                                            </div>
                                        ) : (
                                            <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                                                <Upload className="w-6 h-6 text-zinc-400 mb-1" />
                                                <span className="text-[10px] text-zinc-500 font-medium">Upload</span>
                                                <input type="file" accept="image/*" onChange={handleReviewImageChange} className="hidden" />
                                            </label>
                                        )}
                                    </div>
                                </div>"""
    content = re.sub(r'<div>\s*<label htmlFor="imageUrl"[\s\S]*?not implemented in this form yet.*?</p>\s*</div>', form_image, content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated product review page!")

if __name__ == "__main__":
    modify_file(r"c:\\Users\\user 1\\OneDrive\\Desktop\\wearaura\\src\\app\\products\\[id]\\page.tsx")
