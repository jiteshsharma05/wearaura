"use client";

import Link from "next/link";
import { Sparkles, Compass, Clock, ArrowRight, Layers, ShieldCheck, Feather } from "lucide-react";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-[#131315] text-[#e5e1e4] pb-24">
            {/* 1. Hero Editorial Section */}
            <section className="relative min-h-[550px] md:min-h-[620px] flex flex-col items-center justify-center text-center px-6 py-24 overflow-hidden border-b border-[#9a8f80]/10">
                <div className="absolute inset-0 w-full h-full opacity-25 pointer-events-none">
                    <img
                        src="https://images.unsplash.com/photo-1616984242997-3066d7bdba83?q=80&w=2000&auto=format&fit=crop"
                        alt="Fragrance Essence"
                        className="w-full h-full object-cover object-center mix-blend-screen"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#131315] via-[#131315]/70 to-transparent"></div>
                </div>

                <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-6">
                    <span className="text-xs md:text-sm font-medium text-[#e8c17b] tracking-[0.3em] uppercase">
                        The Architecture of Scent
                    </span>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-[#e5e1e4] leading-tight">
                        Wear Your Aura
                    </h1>
                    <p className="text-base md:text-lg text-[#d1c5b4] max-w-2xl mt-4 leading-relaxed font-light">
                        A bespoke fragrance is not merely an accessory — it is an invisible architecture
                        that harmonizes with your body heat, creating an unmistakable presence.
                    </p>
                </div>
            </section>

            {/* 2. Philosophy Core Tenets - Bento Grid */}
            <section className="px-6 py-24 max-w-[1300px] mx-auto">
                <div className="text-center mb-16 space-y-3">
                    <span className="text-xs font-medium text-[#e8c17b] tracking-[0.3em] uppercase block">
                        Our Foundations
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#e5e1e4]">
                        The Three Pillars
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Rare Distillations (Span 8) */}
                    <article className="md:col-span-8 glass-panel rounded-2xl p-8 md:p-12 relative overflow-hidden group border border-[#9a8f80]/15 hover:border-[#9a8f80]/30 transition-colors min-h-[380px] flex flex-col justify-end">
                        <div className="absolute inset-0 w-full h-full opacity-25 group-hover:opacity-35 transition-opacity duration-700 pointer-events-none">
                            <img
                                className="w-full h-full object-cover grayscale opacity-50 contrast-125 mix-blend-luminosity"
                                src="https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1200&auto=format&fit=crop"
                                alt="Rare Distillations"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e10] via-[#0e0e10]/80 to-transparent"></div>
                        </div>
                        <div className="relative z-10 space-y-4 max-w-xl">
                            <div className="w-12 h-12 rounded-full border border-[#e8c17b]/30 flex items-center justify-center mb-4 text-[#e8c17b]">
                                <Sparkles className="w-5 h-5 stroke-[1.5px]" />
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-serif text-[#e5e1e4]">Rare Distillations</h3>
                            <p className="text-sm md:text-base text-[#d1c5b4] leading-relaxed font-light">
                                Harvested from ethical botanical estates worldwide: Grasse roses, Mysore sandalwood, and ambergris. Each element is meticulously sourced to guarantee unparalleled purity, sillage, and potency.
                            </p>
                        </div>
                    </article>

                    {/* Artisanal Mastery (Span 4) */}
                    <article className="md:col-span-4 glass-panel rounded-2xl p-8 md:p-12 relative overflow-hidden group border border-[#9a8f80]/15 hover:border-[#9a8f80]/30 transition-colors min-h-[380px] flex flex-col justify-between">
                        <div className="w-12 h-12 rounded-full border border-[#e8c17b]/30 flex items-center justify-center text-[#e8c17b] self-end">
                            <Compass className="w-5 h-5 stroke-[1.5px]" />
                        </div>
                        <div className="relative z-10 space-y-4">
                            <h3 className="text-2xl font-serif text-[#e5e1e4]">Artisanal Mastery</h3>
                            <p className="text-sm md:text-base text-[#d1c5b4] leading-relaxed font-light">
                                Matured in small numbered batches to preserve purity, depth, and nuanced complexity on the skin. Every formulation is crafted with surgical precision.
                            </p>
                        </div>
                    </article>

                    {/* Profound Longevity (Span 12) */}
                    <article className="md:col-span-12 glass-panel rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 md:gap-12 border border-[#9a8f80]/15 relative overflow-hidden">
                        <div className="w-16 h-16 shrink-0 rounded-full bg-[#201f21] border border-[#9a8f80]/20 flex items-center justify-center text-[#e8c17b] aura-glow">
                            <Clock className="w-7 h-7 stroke-[1.5px]" />
                        </div>
                        <div className="space-y-3 text-center md:text-left flex-grow">
                            <h3 className="text-2xl font-serif text-[#e5e1e4]">Profound Longevity</h3>
                            <p className="text-sm md:text-base text-[#d1c5b4] leading-relaxed max-w-3xl font-light">
                                High-concentration formulation engineered to release layers smoothly across 12+ hours of wear. An invisible aura that evolves gracefully in tandem with your circadian rhythm.
                            </p>
                        </div>
                    </article>
                </div>
            </section>

            {/* 3. Scent Architecture / Pyramid */}
            <section className="px-6 py-20 max-w-[1200px] mx-auto">
                <div className="text-center mb-16 space-y-3">
                    <span className="text-xs font-medium text-[#e8c17b] tracking-[0.3em] uppercase block">
                        Olfactory Structure
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-serif text-[#e5e1e4]">
                        The Olfactory Journey
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass-panel p-8 rounded-2xl text-center flex flex-col items-center space-y-4">
                        <div className="w-10 h-10 rounded-full bg-[#201f21] border border-[#e8c17b]/30 flex items-center justify-center text-[#e8c17b] font-serif text-sm font-semibold">
                            I
                        </div>
                        <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#e8c17b]">Top Notes</h4>
                        <p className="text-xs text-[#d1c5b4] font-medium tracking-wider uppercase">The First Impression · 0 - 30 Mins</p>
                        <p className="text-sm text-[#d1c5b4]/80 leading-relaxed font-light">
                            Crisp bergamot, saffron, rare citrus, and green aldehydes that greet the senses with radiant freshness.
                        </p>
                    </div>

                    <div className="glass-panel p-8 rounded-2xl text-center flex flex-col items-center space-y-4">
                        <div className="w-10 h-10 rounded-full bg-[#201f21] border border-[#e8c17b]/30 flex items-center justify-center text-[#e8c17b] font-serif text-sm font-semibold">
                            II
                        </div>
                        <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#e8c17b]">Heart Notes</h4>
                        <p className="text-xs text-[#d1c5b4] font-medium tracking-wider uppercase">The Soul · 30 Mins - 4 Hours</p>
                        <p className="text-sm text-[#d1c5b4]/80 leading-relaxed font-light">
                            Rich Grasse rose, cardamom, smoky birch, and velvety jasmine providing depth and emotional resonance.
                        </p>
                    </div>

                    <div className="glass-panel p-8 rounded-2xl text-center flex flex-col items-center space-y-4">
                        <div className="w-10 h-10 rounded-full bg-[#201f21] border border-[#e8c17b]/30 flex items-center justify-center text-[#e8c17b] font-serif text-sm font-semibold">
                            III
                        </div>
                        <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#e8c17b]">Base Notes</h4>
                        <p className="text-xs text-[#d1c5b4] font-medium tracking-wider uppercase">The Lasting Trace · 4 - 12+ Hours</p>
                        <p className="text-sm text-[#d1c5b4]/80 leading-relaxed font-light">
                            Aged agarwood (oud), Mysore sandalwood, amber crystals, and white musk that bond indelibly with your skin.
                        </p>
                    </div>
                </div>
            </section>

            {/* 4. CTA Section */}
            <section className="px-6 py-28 text-center flex flex-col items-center justify-center border-t border-[#9a8f80]/10 relative max-w-3xl mx-auto">
                <span className="text-xs font-medium text-[#e8c17b] tracking-[0.3em] uppercase mb-4 block">
                    Client Services
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#e5e1e4] mb-6">
                    Seeking Your Personal Aura?
                </h2>
                <p className="text-sm md:text-base text-[#d1c5b4] max-w-xl mb-10 leading-relaxed font-light">
                    Our fragrance specialists are at your disposal to guide you towards a scent that matches your distinct profile.
                </p>
                <Link
                    href="/contact"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-[#c9a461] text-[#412d00] rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-[#e8c17b] transition-all duration-300 aura-glow group"
                >
                    <span>Speak with our Concierge</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </section>
        </main>
    );
}
