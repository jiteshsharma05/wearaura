import re

def modify_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Add HeroImage interface
    interface = """interface HeroImage {
  id: string;
  image_url: string;
  title: string | null;
  subtitle: string | null;
  button_text: string | null;
  button_link: string | null;
  sort_order: number;
}

"""
    content = content.replace("interface Product {", interface + "interface Product {")

    # Remove static HERO_IMAGES
    content = re.sub(r'const HERO_IMAGES = \[\s*".*?",\s*".*?",\s*".*?"\s*\];\n', '', content)

    # Add State
    content = content.replace(
        "const [products, setProducts] = useState<Product[]>([]);",
        "const [heroImages, setHeroImages] = useState<HeroImage[]>([]);\n  const [products, setProducts] = useState<Product[]>([]);"
    )

    # Change currentSlide modulo inside useEffect
    content = content.replace("HERO_IMAGES.length)", "(heroImages.length || 1))")
    
    # In fetchProducts useEffect, also fetch heroImages
    fetch_hero = """
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
"""
    content = content.replace("const fetchProducts = async () => {", fetch_hero + "\n    const fetchProducts = async () => {")

    # Add fetchHeroImages() to the end of the effect
    content = content.replace("fetchProducts();", "fetchHeroImages();\n    fetchProducts();")

    # handleDragEnd update
    content = content.replace("HERO_IMAGES.length", "heroImages.length")

    # Render Update
    render_hero = """        <AnimatePresence initial={false} custom={currentSlide}>
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
        </AnimatePresence>"""

    # We need to replace the AnimatePresence block inside section
    content = re.sub(
        r'<AnimatePresence initial=\{false\} custom=\{currentSlide\}>[\s\S]*?</AnimatePresence>',
        render_hero,
        content
    )

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated homepage hero!")

if __name__ == "__main__":
    modify_file(r"c:\\Users\\user 1\\OneDrive\\Desktop\\wearaura\\src\\app\\page.tsx")
