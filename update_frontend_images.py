import re
import os

files_to_update = [
    r"c:\Users\user 1\OneDrive\Desktop\wearaura\src\components\CartProvider.tsx",
    r"c:\Users\user 1\OneDrive\Desktop\wearaura\src\app\wishlist\page.tsx",
    r"c:\Users\user 1\OneDrive\Desktop\wearaura\src\app\products\[id]\page.tsx",
    r"c:\Users\user 1\OneDrive\Desktop\wearaura\src\app\page.tsx",
    r"c:\Users\user 1\OneDrive\Desktop\wearaura\src\app\my-orders\page.tsx",
    r"c:\Users\user 1\OneDrive\Desktop\wearaura\src\app\cart\page.tsx",
]

def process_file(filepath):
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Add images?: string[] to interfaces where image_url exists
    content = re.sub(r'(image_url:\s*string\s*\|\s*null;)', r'\1\n    images?: string[];', content)
    content = re.sub(r'(image_url:\s*string;)', r'\1\n    images?: string[];', content)
    
    # Update Supabase selects to include images
    content = content.replace("image_url, category", "image_url, images, category")
    content = content.replace("image_url, created_at", "image_url, images, created_at")
    content = content.replace("name, image_url", "name, image_url, images")
    
    # Update JSX image src rendering
    # {product.image_url ? ( <img src={product.image_url} ... /> ) ... }
    # Let's be smart about the replace.
    
    def replacer(match):
        prefix = match.group(1) # item.product. or product. or item. or relProduct.
        return f"(({prefix}images && {prefix}images.length > 0) ? {prefix}images[0] : {prefix}image_url)"

    # Look for {xxx.image_url ?
    content = re.sub(r'\{([a-zA-Z0-9_\.]+?)image_url \?', r'{\1images && \1images.length > 0 ? \1images[0] : \1image_url ?', content)
    
    # Look for src={xxx.image_url}
    content = re.sub(r'src=\{([a-zA-Z0-9_\.]+?)image_url\}', r'src={(\1images && \1images.length > 0) ? \1images[0] : (\1image_url || "")}', content)

    # Specific fix for cart provider CartItem conversion
    content = content.replace("image_url: product.image_url,", "image_url: product.image_url,\n                    images: product.images,")
    
    # In products/[id]/page.tsx, product gallery needs to use images array mostly
    if "galleryImages = " in content:
        content = re.sub(
            r"const galleryImages = \[product\.image_url, \.\.\.reviews\.map\(r => r\.image_url\)\.filter\(Boolean\)\]\.filter\(Boolean\);",
            "const galleryImages = [...(product.images || []), ...(product.images?.length ? [] : [product.image_url]), ...reviews.map(r => r.image_url).filter(Boolean)].filter(Boolean);",
            content
        )

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated {filepath}")

for f in files_to_update:
    process_file(f)
