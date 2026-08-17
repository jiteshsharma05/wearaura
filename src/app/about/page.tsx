"use client";

import Link from "next/link";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-[#FAF9F6]">
            {/* Hero Section */}
            <section className="relative h-[45vh] flex items-center justify-center overflow-hidden bg-[#1a1a1a]">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-black/60 z-10"></div>
                    <img
                        src="https://images.unsplash.com/photo-1616984242997-3066d7bdba83?q=80&w=2000&auto=format&fit=crop"
                        alt="Fragrance"
                        className="w-full h-full object-cover opacity-60"
                    />
                </div>
                <div className="container mx-auto px-4 relative z-20 text-center">
                    <h1 className="text-4xl md:text-6xl font-serif font-light text-white tracking-wide mb-4">
                        The Art of Fragrance
                    </h1>
                    <p className="text-lg text-zinc-300 font-light max-w-2xl mx-auto">
                        Crafting invisible art that lingers in the memory.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-20 max-w-4xl">

                {/* Intro */}
                <p className="text-lg text-[#4a4a4a] leading-relaxed mb-12 font-light text-center max-w-2xl mx-auto">
                    Fragrance is the most intimate form of self-expression. A scent doesn't just surround you — it becomes you. It is your aura, made tangible, leaving a trace of who you are in every room you enter.
                </p>

                {/* Philosophy & Craftsmanship */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 my-16">
                    <div className="space-y-4 border-l-2 border-[#c4a8d4] pl-6">
                        <h2 className="text-xl font-serif tracking-tight text-[#1a1a1a]">The Philosophy of Scent</h2>
                        <p className="text-[#4a4a4a] leading-relaxed font-light">
                            We believe a fragrance should tell a story — one that unfolds over hours, evolving from the first crisp top note to the warm, settled depth of a dry-down. Every bottle of WearAura is composed with intention, using only the finest essential oils and aromatic compounds.
                        </p>
                    </div>
                    <div className="space-y-4 border-l-2 border-[#c4a8d4] pl-6">
                        <h2 className="text-xl font-serif tracking-tight text-[#1a1a1a]">Craftsmanship &amp; Complexity</h2>
                        <p className="text-[#4a4a4a] leading-relaxed font-light">
                            Great perfumery is architecture. Our Master Perfumers layer top, heart, and base notes with precision — creating complex, multi-dimensional scents that breathe and evolve beautifully on the skin throughout the day.
                        </p>
                    </div>
                </div>

                {/* Scent Journey */}
                <div className="bg-[#f0eeea] border border-[#e8e6e1] p-10 rounded-[4px] my-16">
                    <h2 className="text-2xl font-serif text-[#1a1a1a] mb-6 tracking-wide">Understanding a Fragrance</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                        <div className="text-center space-y-3">
                            <div className="w-12 h-12 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center mx-auto font-serif text-lg">T</div>
                            <h3 className="font-medium text-[#1a1a1a] text-sm uppercase tracking-widest">Top Notes</h3>
                            <p className="text-sm text-[#8a8a8a] font-light leading-relaxed">The first impression — fresh, bright, and fleeting. Citrus, herbs, and light florals.</p>
                        </div>
                        <div className="text-center space-y-3">
                            <div className="w-12 h-12 rounded-full bg-[#3d2a4d] text-white flex items-center justify-center mx-auto font-serif text-lg">H</div>
                            <h3 className="font-medium text-[#1a1a1a] text-sm uppercase tracking-widest">Heart Notes</h3>
                            <p className="text-sm text-[#8a8a8a] font-light leading-relaxed">The soul of the scent — emerging after 20 minutes. Rich florals, warm spices, and soft woods.</p>
                        </div>
                        <div className="text-center space-y-3">
                            <div className="w-12 h-12 rounded-full bg-[#c4a8d4] text-white flex items-center justify-center mx-auto font-serif text-lg">B</div>
                            <h3 className="font-medium text-[#1a1a1a] text-sm uppercase tracking-widest">Base Notes</h3>
                            <p className="text-sm text-[#8a8a8a] font-light leading-relaxed">The lasting memory — deep musks, sandalwood, amber, and resins that anchor the fragrance.</p>
                        </div>
                    </div>
                </div>

                {/* Sustainability */}
                <div className="my-16 space-y-4">
                    <h2 className="text-2xl font-serif text-[#1a1a1a] tracking-tight">Refined &amp; Responsible</h2>
                    <p className="text-[#4a4a4a] font-light leading-relaxed">
                        Luxury shouldn't cost the earth. All WearAura packaging is 100% recyclable, and every fragrance is crafted without animal testing. Our ingredients are ethically sourced from sustainable suppliers who share our commitment to quality and care.
                    </p>
                </div>

                {/* CTA */}
                <div className="bg-[#1a1a1a] p-10 sm:p-14 rounded-[4px] mt-20 text-center">
                    <h2 className="text-2xl font-serif font-light text-white tracking-wide mb-4">Find Your Signature Scent</h2>
                    <p className="text-[#8a8a8a] mb-10 max-w-md mx-auto font-light">
                        Browse our curated collection of hand-crafted fragrances and discover the one that speaks to your aura.
                    </p>
                    <Link
                        href="/"
                        className="inline-block px-8 py-4 bg-[#FAF9F6] text-[#1a1a1a] font-medium hover:bg-white transition-all shadow-sm rounded-[2px] text-sm tracking-wide"
                    >
                        Explore Collection
                    </Link>
                </div>
            </div>
        </main>
    );
}
