import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Cancellation Policy — WearAura",
    description:
        "Understand WearAura's order cancellation policy, including timelines and how to request a cancellation.",
};

export default function CancellationPolicyPage() {
    return (
        <main className="min-h-screen bg-[#FAF9F6]">
            {/* Hero */}
            <section className="bg-[#1a1a1a] py-20 border-b border-[#e8e6e1]">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-serif font-light text-[#FAF9F6] tracking-wide mb-4">
                        Cancellation Policy
                    </h1>
                    <p className="text-sm text-[#8a8a8a] font-light">
                        Last Updated: March 2026
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-20 max-w-3xl">
                <p className="text-lg text-[#4a4a4a] leading-relaxed mb-12 font-light text-center max-w-2xl mx-auto">
                    We understand that plans can change. Here&apos;s
                    everything you need to know about cancelling an order
                    with WearAura.
                </p>

                {/* Section 1 */}
                <section className="mb-12">
                    <h2 className="text-xl font-serif tracking-tight text-[#1a1a1a] mb-4 border-l-2 border-[#c4a8d4] pl-4">
                        When You Can Cancel
                    </h2>
                    <div className="bg-[#f0eeea] border border-[#e8e6e1] rounded-[4px] p-6">
                        <p className="text-[#4a4a4a] font-light leading-relaxed">
                            <strong className="font-medium text-[#1a1a1a]">
                                You may cancel your order at any time before it
                                has been shipped.
                            </strong>{" "}
                            To request a cancellation, email us with your order
                            number and we&apos;ll process it promptly.
                        </p>
                    </div>
                </section>

                {/* Section 2 */}
                <section className="mb-12">
                    <h2 className="text-xl font-serif tracking-tight text-[#1a1a1a] mb-4 border-l-2 border-[#c4a8d4] pl-4">
                        Once Your Order Has Been Shipped
                    </h2>
                    <p className="text-[#4a4a4a] font-light leading-relaxed">
                        Once your order has been dispatched and is in transit,
                        cancellation is no longer possible. At this stage, you
                        may refer to our{" "}
                        <a
                            href="/policies/return-refund-exchange"
                            className="text-[#1a1a1a] underline underline-offset-4 decoration-[#c4a8d4] hover:decoration-[#1a1a1a] transition-colors"
                        >
                            Return, Refund &amp; Exchange Policy
                        </a>{" "}
                        for available options after delivery.
                    </p>
                </section>

                {/* Section 3 */}
                <section className="mb-12">
                    <h2 className="text-xl font-serif tracking-tight text-[#1a1a1a] mb-4 border-l-2 border-[#c4a8d4] pl-4">
                        How to Request a Cancellation
                    </h2>
                    <p className="text-[#4a4a4a] font-light leading-relaxed mb-4">
                        To cancel your order before it&apos;s shipped:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="text-center space-y-3 p-4">
                            <div className="w-10 h-10 bg-[#1a1a1a] text-white rounded-full flex items-center justify-center mx-auto font-serif text-sm">
                                1
                            </div>
                            <p className="text-sm text-[#4a4a4a] font-light">
                                Email us at{" "}
                                <strong className="font-medium">
                                    wearaurafragrance@gmail.com
                                </strong>
                            </p>
                        </div>
                        <div className="text-center space-y-3 p-4">
                            <div className="w-10 h-10 bg-[#3d2a4d] text-white rounded-full flex items-center justify-center mx-auto font-serif text-sm">
                                2
                            </div>
                            <p className="text-sm text-[#4a4a4a] font-light">
                                Include your{" "}
                                <strong className="font-medium">
                                    order number
                                </strong>{" "}
                                and the reason for cancellation
                            </p>
                        </div>
                        <div className="text-center space-y-3 p-4">
                            <div className="w-10 h-10 bg-[#c4a8d4] text-white rounded-full flex items-center justify-center mx-auto font-serif text-sm">
                                3
                            </div>
                            <p className="text-sm text-[#4a4a4a] font-light">
                                We&apos;ll confirm the cancellation within{" "}
                                <strong className="font-medium">
                                    24 hours
                                </strong>
                            </p>
                        </div>
                    </div>
                </section>

                {/* Section 4 */}
                <section className="mb-12">
                    <h2 className="text-xl font-serif tracking-tight text-[#1a1a1a] mb-4 border-l-2 border-[#c4a8d4] pl-4">
                        Cancellation by WearAura
                    </h2>
                    <p className="text-[#4a4a4a] font-light leading-relaxed mb-4">
                        In rare cases, we may need to cancel your order due to:
                    </p>
                    <ul className="space-y-2 text-[#4a4a4a] font-light leading-relaxed list-disc list-inside ml-4">
                        <li>Product being out of stock or discontinued</li>
                        <li>
                            Pricing or listing errors on the website
                        </li>
                        <li>Suspected fraudulent activity</li>
                        <li>
                            Inability to deliver to the provided address
                        </li>
                    </ul>
                    <p className="text-[#4a4a4a] font-light leading-relaxed mt-4">
                        If we cancel your order, you will be notified
                        immediately via email and any payment already made will
                        be fully refunded.
                    </p>
                </section>

                {/* Contact */}
                <div className="bg-[#1a1a1a] p-10 rounded-[4px] mt-16 text-center">
                    <h2 className="text-xl font-serif font-light text-white tracking-wide mb-3">
                        Need to Cancel an Order?
                    </h2>
                    <p className="text-[#8a8a8a] font-light mb-2">
                        Get in touch as soon as possible at
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
