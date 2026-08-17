import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Product Disclaimer — WearAura",
    description:
        "Important information about fragrance perception, longevity, and product expectations at WearAura.",
};

export default function ProductDisclaimerPage() {
    return (
        <main className="min-h-screen bg-[#FAF9F6]">
            {/* Hero */}
            <section className="bg-[#1a1a1a] py-20 border-b border-[#e8e6e1]">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-serif font-light text-[#FAF9F6] tracking-wide mb-4">
                        Product Disclaimer
                    </h1>
                    <p className="text-sm text-[#8a8a8a] font-light">
                        Last Updated: March 2026
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-20 max-w-3xl">
                <p className="text-lg text-[#4a4a4a] leading-relaxed mb-12 font-light text-center max-w-2xl mx-auto">
                    Fragrance is one of the most personal forms of
                    self-expression. Before you purchase, here are a few
                    important things to understand about perfume as a product.
                </p>

                {/* Section 1 */}
                <section className="mb-12">
                    <h2 className="text-xl font-serif tracking-tight text-[#1a1a1a] mb-4 border-l-2 border-[#c4a8d4] pl-4">
                        Fragrance Is Subjective
                    </h2>
                    <div className="bg-[#f0eeea] border border-[#e8e6e1] rounded-[4px] p-6">
                        <p className="text-[#4a4a4a] font-light leading-relaxed">
                            Every person experiences scent differently. A
                            fragrance that one person loves may not appeal to
                            another — and that&apos;s perfectly natural.
                            Descriptions, notes, and reviews on our website are
                            meant to guide your selection, but the final
                            experience will always be unique to you.{" "}
                            <strong className="font-medium text-[#1a1a1a]">
                                We do not accept returns based on personal scent
                                preference.
                            </strong>
                        </p>
                    </div>
                </section>

                {/* Section 2 */}
                <section className="mb-12">
                    <h2 className="text-xl font-serif tracking-tight text-[#1a1a1a] mb-4 border-l-2 border-[#c4a8d4] pl-4">
                        Longevity &amp; Projection
                    </h2>
                    <p className="text-[#4a4a4a] font-light leading-relaxed mb-4">
                        How long a fragrance lasts and how far it projects
                        depend on several factors, including:
                    </p>
                    <ul className="space-y-2 text-[#4a4a4a] font-light leading-relaxed list-disc list-inside ml-4">
                        <li>
                            <strong className="font-medium">Skin type</strong>{" "}
                            — Oily skin tends to retain scent longer than dry
                            skin
                        </li>
                        <li>
                            <strong className="font-medium">Weather &amp; climate</strong>{" "}
                            — Heat amplifies fragrance, while cold may reduce
                            projection
                        </li>
                        <li>
                            <strong className="font-medium">Application method</strong>{" "}
                            — Spraying on pulse points helps a fragrance last
                            longer
                        </li>
                        <li>
                            <strong className="font-medium">Fragrance concentration</strong>{" "}
                            — Eau de Parfum vs Eau de Toilette have different
                            performance levels
                        </li>
                    </ul>
                    <p className="text-[#8a8a8a] font-light text-sm mt-4 italic">
                        Longevity claims on our website are approximate and
                        based on average conditions. Individual results may
                        vary.
                    </p>
                </section>

                {/* Section 3 */}
                <section className="mb-12">
                    <h2 className="text-xl font-serif tracking-tight text-[#1a1a1a] mb-4 border-l-2 border-[#c4a8d4] pl-4">
                        Colour &amp; Packaging
                    </h2>
                    <p className="text-[#4a4a4a] font-light leading-relaxed">
                        The colour of the product on screen may differ slightly
                        from the actual product due to screen settings,
                        lighting conditions, and the nature of fragrance oils.
                        Packaging designs may also be updated from time to time
                        without prior notice.
                    </p>
                </section>

                {/* Section 4 */}
                <section className="mb-12">
                    <h2 className="text-xl font-serif tracking-tight text-[#1a1a1a] mb-4 border-l-2 border-[#c4a8d4] pl-4">
                        Allergies &amp; Sensitivities
                    </h2>
                    <p className="text-[#4a4a4a] font-light leading-relaxed">
                        If you have sensitive skin or are prone to allergies, we
                        recommend testing the fragrance on a small patch of skin
                        before full application. WearAura is not responsible for
                        any skin reactions or allergic responses to our
                        products.
                    </p>
                </section>

                {/* Section 5 */}
                <section className="mb-12">
                    <h2 className="text-xl font-serif tracking-tight text-[#1a1a1a] mb-4 border-l-2 border-[#c4a8d4] pl-4">
                        Product Descriptions
                    </h2>
                    <p className="text-[#4a4a4a] font-light leading-relaxed">
                        We make every effort to ensure that all product
                        descriptions, note breakdowns, and images on our
                        website are accurate. However, these are intended as
                        guides and not guarantees. The way a fragrance smells
                        and performs on your skin is influenced by your body
                        chemistry and environment.
                    </p>
                </section>

                {/* Section 6 */}
                <section className="mb-12">
                    <h2 className="text-xl font-serif tracking-tight text-[#1a1a1a] mb-4 border-l-2 border-[#c4a8d4] pl-4">
                        No Returns on Preference
                    </h2>
                    <div className="bg-[#f0eeea] border border-[#e8e6e1] rounded-[4px] p-6">
                        <p className="text-[#4a4a4a] font-light leading-relaxed">
                            As fragrances are intimate and personal products, we
                            do not offer returns, refunds, or exchanges based on
                            scent preference, perceived longevity, or personal
                            expectations. Please refer to our{" "}
                            <a
                                href="/policies/return-refund-exchange"
                                className="text-[#1a1a1a] underline underline-offset-4 decoration-[#c4a8d4] hover:decoration-[#1a1a1a] transition-colors"
                            >
                                Return, Refund &amp; Exchange Policy
                            </a>{" "}
                            for eligible scenarios.
                        </p>
                    </div>
                </section>

                {/* Contact */}
                <div className="bg-[#1a1a1a] p-10 rounded-[4px] mt-16 text-center">
                    <h2 className="text-xl font-serif font-light text-white tracking-wide mb-3">
                        Have a Product Question?
                    </h2>
                    <p className="text-[#8a8a8a] font-light mb-2">
                        We&apos;re always happy to help at
                    </p>
                    <a
                        href="mailto:wearaurafragrance@gmail.com"
                        className="text-[#c4a8d4] hover:text-white transition-colors font-light underline underline-offset-4"
                    >
                        wearaurafragrance@gmail.com
                    </a>
                </div>
            </div>
        </main>
    );
}
