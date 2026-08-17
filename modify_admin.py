import re
import sys

def modify_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update Product interface
    content = content.replace(
        "image_url: string;",
        "image_url: string;\n    images?: string[];"
    )

    # 2. Add multiple image states in Product creation
    if "imageFiles" not in content:
        content = content.replace(
            "const [imageFile, setImageFile] = useState<File | null>(null);\n    const [imagePreview, setImagePreview] = useState<string | null>(null);",
            "const [imageFiles, setImageFiles] = useState<File[]>([]);\n    const [imagePreviews, setImagePreviews] = useState<string[]>([]);"
        )
    
    # 3. Add multiple image states in Edit
    if "editImageFiles" not in content:
        content = content.replace(
            """    const [editForm, setEditForm] = useState({
        name: '',
        description: '',
        price: '',
        stock: '0',
        image_url: '',
        status: 'available'
    });""",
            """    const [editForm, setEditForm] = useState<{
        name: string;
        description: string;
        price: string;
        stock: string;
        image_url: string;
        images: string[];
        status: string;
    }>({
        name: '',
        description: '',
        price: '',
        stock: '0',
        image_url: '',
        images: [],
        status: 'available'
    });
    const [editImageFiles, setEditImageFiles] = useState<File[]>([]);
    const [editImagePreviews, setEditImagePreviews] = useState<string[]>([]);
"""
        )

    # 4. Fetch Products - add images to select
    content = content.replace(
        ".select('id, name, description, price, stock, image_url, status')",
        ".select('id, name, description, price, stock, image_url, images, status')"
    )

    # 5. Handle Image Change for new product
    if "removeNewImage" not in content:
        content = content.replace(
            """    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };""",
            """    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);
            setImageFiles(prev => [...prev, ...files]);
            setImagePreviews(prev => [...prev, ...files.map(file => URL.createObjectURL(file))]);
        }
    };

    const removeNewImage = (index: number) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };"""
        )
    
    # 6. handleAddProduct changes
    add_product_replacement = """            let finalImageUrl = newProduct.image_url;
            let uploadedImages: string[] = [];

            if (imageFiles && imageFiles.length > 0) {
                try {
                    const uploadPromises = imageFiles.map(file => uploadImageToCloudinary(file));
                    uploadedImages = await Promise.all(uploadPromises);
                    if (uploadedImages.length > 0) {
                        finalImageUrl = uploadedImages[0];
                    }
                } catch (uploadError: any) {
                    toast.error(`Error uploading image: ${uploadError.message}`);
                    setIsSubmitting(false);
                    return;
                }
            }

            const { error } = await supabase
                .from('products')
                .insert([{
                    name: newProduct.name,
                    description: newProduct.description,
                    price: parseFloat(newProduct.price),
                    stock: parseInt(newProduct.stock, 10),
                    image_url: finalImageUrl || null,
                    images: uploadedImages,
                    status: newProduct.status,
                }]);"""
    
    # Replacing the block using a simple string replace
    old_add_product = """            let finalImageUrl = newProduct.image_url;

            if (imageFile) {
                try {
                    finalImageUrl = await uploadImageToCloudinary(imageFile);
                } catch (uploadError: any) {
                    toast.error(`Error uploading image: ${uploadError.message}`);
                    setIsSubmitting(false);
                    return;
                }
            }

            const { error } = await supabase
                .from('products')
                .insert([{
                    name: newProduct.name,
                    description: newProduct.description,
                    price: parseFloat(newProduct.price),
                    stock: parseInt(newProduct.stock, 10),
                    image_url: finalImageUrl || null,
                    status: newProduct.status,
                }]);"""
    
    content = content.replace(old_add_product, add_product_replacement)
    
    # 7. clear newProduct states on success
    content = content.replace(
        "setImageFile(null);\n            setImagePreview(null);",
        "setImageFiles([]);\n            setImagePreviews([]);"
    )

    # 8. handleEditClick update
    old_edit_click = """    const handleEditClick = (product: Product) => {
        setEditingProductId(product.id);
        setEditForm({
            name: product.name,
            description: product.description || '',
            price: product.price.toString(),
            stock: product.stock.toString(),
            image_url: product.image_url || '',
            status: product.status || 'available'
        });
    };"""
    new_edit_click = """    const handleEditClick = (product: Product) => {
        setEditingProductId(product.id);
        setEditForm({
            name: product.name,
            description: product.description || '',
            price: product.price.toString(),
            stock: product.stock.toString(),
            image_url: product.image_url || '',
            images: product.images || (product.image_url ? [product.image_url] : []),
            status: product.status || 'available'
        });
        setEditImageFiles([]);
        setEditImagePreviews([]);
    };"""
    content = content.replace(old_edit_click, new_edit_click)
    
    # 9. handleSaveEdit update
    old_save_edit = """    const handleSaveEdit = async (productId: string) => {
        setIsSavingEdit(true);
        try {
            const { error } = await supabase
                .from('products')
                .update({
                    name: editForm.name,
                    description: editForm.description,
                    price: parseFloat(editForm.price),
                    stock: parseInt(editForm.stock, 10),
                    image_url: editForm.image_url || null,
                    status: editForm.status,
                })
                .eq('id', productId);

            if (error) toast.error(`Error updating product: ${error.message}`);
            else {
                toast.success('Product updated successfully');
                setProducts(products.map(p => p.id === productId ? {
                    ...p,
                    ...editForm,
                    price: parseFloat(editForm.price),
                    stock: parseInt(editForm.stock, 10)
                } : p));
                setEditingProductId(null);
            }
        } catch (err: any) {
            toast.error(err.message || 'Error updating product');
        } finally {
            setIsSavingEdit(false);
        }
    };"""
    
    new_save_edit = """    const handleSaveEdit = async (productId: string) => {
        setIsSavingEdit(true);
        try {
            let uploadedImages = [...editForm.images];
            if (editImageFiles.length > 0) {
                const uploadPromises = editImageFiles.map(file => uploadImageToCloudinary(file));
                const newUrls = await Promise.all(uploadPromises);
                uploadedImages = [...uploadedImages, ...newUrls];
            }
            const finalImageUrl = uploadedImages.length > 0 ? uploadedImages[0] : null;

            const { error } = await supabase
                .from('products')
                .update({
                    name: editForm.name,
                    description: editForm.description,
                    price: parseFloat(editForm.price),
                    stock: parseInt(editForm.stock, 10),
                    image_url: finalImageUrl,
                    images: uploadedImages,
                    status: editForm.status,
                })
                .eq('id', productId);

            if (error) toast.error(`Error updating product: ${error.message}`);
            else {
                toast.success('Product updated successfully');
                setEditingProductId(null);
                fetchProducts();
            }
        } catch (err: any) {
            toast.error(err.message || 'Error updating product');
        } finally {
            setIsSavingEdit(false);
        }
    };"""
    content = content.replace(old_save_edit, new_save_edit)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print("Modifications done!")

if __name__ == "__main__":
    modify_file(r"c:\\Users\\user 1\\OneDrive\\Desktop\\wearaura\\src\\app\\admin\\page.tsx")
