import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Return, Refund & Exchange Policy — WearAura",
    description:
        "Understand WearAura's return, refund, and exchange policy, including eligibility, timelines, and how to file a claim.",
};

export default function ReturnRefundExchangePage() {
    return (
        <main className="min-h-screen bg-[#FAF9F6]">
            {/* Hero */}
            <section className="bg-[#1a1a1a] py-20 border-b border-[#e8e6e1]">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-serif font-light text-[#FAF9F6] tracking-wide mb-4">
                        Return, Refund &amp; Exchange
                    </h1>
                    <p className="text-sm text-[#8a8a8a] font-light">
                        Last Updated: March 2026
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-20 max-w-3xl">
                <p className="text-lg text-[#4a4a4a] leading-relaxed mb-12 font-light text-center max-w-2xl mx-auto">
                    Your satisfaction matters to us. While fragrances are
                    personal and intimate products, we stand behind the quality
                    of every bottle we ship. Here&apos;s our fair and
                    transparent policy.
                </p>

                {/* When Returns Are Accepted */}
                <section className="mb-12">
                    <h2 className="text-xl font-serif tracking-tight text-[#1a1a1a] mb-4 border-l-2 border-[#c4a8d4] pl-4">
                        When Returns Are Accepted
                    </h2>
                    <p className="text-[#4a4a4a] font-light leading-relaxed mb-4">
                        We accept returns only under the following circumstances:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-[#f0eeea] border border-[#e8e6e1] rounded-[4px] p-5">
                            <h3 className="font-medium text-[#1a1a1a] text-sm mb-2">
                                Damaged Product
                            </h3>
                            <p className="text-sm text-[#4a4a4a] font-light leading-relaxed">
                                The product arrived broken, leaking, or visibly
                                damaged during transit.
                            </p>
                        </div>
                        <div className="bg-[#f0eeea] border border-[#e8e6e1] rounded-[4px] p-5">
                            <h3 className="font-medium text-[#1a1a1a] text-sm mb-2">
                                Wrong Product
                            </h3>
                            <p className="text-sm text-[#4a4a4a] font-light leading-relaxed">
                                You received a different product than what you
                                ordered.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Returns Not Accepted */}
                <section className="mb-12">
                    <h2 className="text-xl font-serif tracking-tight text-[#1a1a1a] mb-4 border-l-2 border-[#c4a8d4] pl-4">
                        Returns Are Not Accepted For
                    </h2>
                    <div className="bg-[#f0eeea] border border-[#e8e6e1] rounded-[4px] p-6">
                        <p className="text-[#4a4a4a] font-light leading-relaxed mb-4">
                            Due to the personal and hygiene-sensitive nature of
                            fragrances, we{" "}
                            <strong className="font-medium text-[#1a1a1a]">
                                cannot accept returns
                            </strong>{" "}
                            for the following reasons:
                        </p>
                        <ul className="space-y-2 text-[#4a4a4a] font-light leading-relaxed list-disc list-inside ml-2">
                            <li>Change of mind after purchase</li>
                            <li>Not liking the fragrance or scent profile</li>
                            <li>Longevity or projection concerns</li>
                            <li>Personal preference differences</li>
                        </ul>
                    </div>
                </section>

                {/* 48h Timeline */}
                <section className="mb-12">
                    <h2 className="text-xl font-serif tracking-tight text-[#1a1a1a] mb-4 border-l-2 border-[#c4a8d4] pl-4">
                        Reporting Timeline
                    </h2>
                    <div className="flex items-center gap-5 bg-white border border-[#e8e6e1] rounded-[4px] p-6 shadow-sm">
                        <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center shrink-0">
                            <span className="text-white font-serif text-xl font-light">
                                48h
                            </span>
                        </div>
                        <div>
                            <p className="text-[#1a1a1a] font-medium mb-1">
                                Report Within 48 Hours
                            </p>
                            <p className="text-sm text-[#4a4a4a] font-light leading-relaxed">
                                Any issues must be reported within 48 hours of
                                delivery. Claims raised after this window may
                                not be eligible for return or exchange.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Proof Required */}
                <section className="mb-12">
                    <h2 className="text-xl font-serif tracking-tight text-[#1a1a1a] mb-4 border-l-2 border-[#c4a8d4] pl-4">
                        Proof Required
                    </h2>
                    <ul className="space-y-2 text-[#4a4a4a] font-light leading-relaxed list-disc list-inside ml-4">
                        <li>
                            <strong className="font-medium">Clear photographs</strong>{" "}
                            of the damaged or incorrect product
                        </li>
                        <li>
                            <strong className="font-medium">An unboxing video</strong>{" "}
                            (strongly recommended for damage claims)
                        </li>
                        <li>Your order number and delivery details</li>
                    </ul>
                    <p className="text-[#8a8a8a] font-light text-sm mt-4 italic">
                        We recommend filming the unboxing of every order as a
                        precaution. This helps us resolve issues faster.
                    </p>
                </section>

                {/* Product Condition */}
                <section className="mb-12">
                    <h2 className="text-xl font-serif tracking-tight text-[#1a1a1a] mb-4 border-l-2 border-[#c4a8d4] pl-4">
                        Product Condition for Returns
                    </h2>
                    <ul className="space-y-2 text-[#4a4a4a] font-light leading-relaxed list-disc list-inside ml-4">
                        <li>Product must be <strong className="font-medium">unused</strong></li>
                        <li>Original packaging must be <strong className="font-medium">intact</strong></li>
                        <li>
                            Seal must be <strong className="font-medium">unbroken</strong>{" "}
                            (unless the product arrived damaged)
                        </li>
                    </ul>
                </section>

                {/* Exchange vs Refund */}
                <section className="mb-12">
                    <h2 className="text-xl font-serif tracking-tight text-[#1a1a1a] mb-4 border-l-2 border-[#c4a8d4] pl-4">
                        Exchange vs Refund
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-[#1a1a1a] rounded-[4px] p-6 text-center">
                            <p className="text-xs uppercase tracking-widest text-[#c4a8d4] mb-2">Preferred</p>
                            <p className="text-white font-serif text-lg mb-2">Exchange</p>
                            <p className="text-[#8a8a8a] font-light text-sm leading-relaxed">
                                We&apos;ll send you the correct or replacement
                                product at no additional cost.
                            </p>
                        </div>
                        <div className="bg-white border border-[#e8e6e1] rounded-[4px] p-6 text-center">
                            <p className="text-xs uppercase tracking-widest text-[#8a8a8a] mb-2">
                                If Exchange Isn&apos;t Possible
                            </p>
                            <p className="text-[#1a1a1a] font-serif text-lg mb-2">Refund</p>
                            <p className="text-[#4a4a4a] font-light text-sm leading-relaxed">
                                Processed within{" "}
                                <strong className="font-medium">5–7 business days</strong>{" "}
                                to your original payment method.
                            </p>
                        </div>
                    </div>
                </section>

                {/* How to Initiate */}
                <section className="mb-12">
                    <h2 className="text-xl font-serif tracking-tight text-[#1a1a1a] mb-4 border-l-2 border-[#c4a8d4] pl-4">
                        How to Initiate a Return or Exchange
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="text-center space-y-3 p-4">
                            <div className="w-10 h-10 bg-[#1a1a1a] text-white rounded-full flex items-center justify-center mx-auto font-serif text-sm">1</div>
                            <p className="text-sm text-[#4a4a4a] font-light">
                                Email us at <strong className="font-medium">wearaurafragrance@gmail.com</strong> within 48 hours
                            </p>
                        </div>
                        <div className="text-center space-y-3 p-4">
                            <div className="w-10 h-10 bg-[#3d2a4d] text-white rounded-full flex items-center justify-center mx-auto font-serif text-sm">2</div>
                            <p className="text-sm text-[#4a4a4a] font-light">
                                Attach <strong className="font-medium">photos or an unboxing video</strong> with your order number
                            </p>
                        </div>
                        <div className="text-center space-y-3 p-4">
                            <div className="w-10 h-10 bg-[#c4a8d4] text-white rounded-full flex items-center justify-center mx-auto font-serif text-sm">3</div>
                            <p className="text-sm text-[#4a4a4a] font-light">
                                Our team will review and respond within <strong className="font-medium">24–48 hours</strong>
                            </p>
                        </div>
                    </div>
                </section>

                {/* Contact CTA */}
                <div className="bg-[#1a1a1a] p-10 rounded-[4px] mt-16 text-center">
                    <h2 className="text-xl font-serif font-light text-white tracking-wide mb-3">
                        Have an Issue With Your Order?
                    </h2>
                    <p className="text-[#8a8a8a] font-light mb-2">Let us know right away at</p>
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
