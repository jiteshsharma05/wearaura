import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Shipping Policy — WearAura",
    description:
        "Learn about WearAura's shipping timelines, delivery coverage, and what to expect when your order is on its way.",
};

export default function ShippingPolicyPage() {
    return (
        <main className="min-h-screen bg-[#FAF9F6]">
            {/* Hero */}
            <section className="bg-[#1a1a1a] py-20 border-b border-[#e8e6e1]">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-serif font-light text-[#FAF9F6] tracking-wide mb-4">
                        Shipping Policy
                    </h1>
                    <p className="text-sm text-[#8a8a8a] font-light">
                        Last Updated: March 2026
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-20 max-w-3xl">
                <p className="text-lg text-[#4a4a4a] leading-relaxed mb-12 font-light text-center max-w-2xl mx-auto">
                    We want your WearAura fragrance to reach you as quickly
                    and safely as possible. Here&apos;s everything you need to
                    know about our shipping process.
                </p>

                {/* Section 1 */}
                <section className="mb-12">
                    <h2 className="text-xl font-serif tracking-tight text-[#1a1a1a] mb-4 border-l-2 border-[#c4a8d4] pl-4">
                        Delivery Coverage
                    </h2>
                    <p className="text-[#4a4a4a] font-light leading-relaxed">
                        We currently ship to all serviceable pin codes within
                        India. International shipping is not available at this
                        time. We&apos;re working on expanding our reach and
                        will update this page when international orders become
                        available.
                    </p>
                </section>

                {/* Section 2 */}
                <section className="mb-12">
                    <h2 className="text-xl font-serif tracking-tight text-[#1a1a1a] mb-4 border-l-2 border-[#c4a8d4] pl-4">
                        Estimated Delivery Time
                    </h2>
                    <div className="bg-[#f0eeea] border border-[#e8e6e1] rounded-[4px] p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-[#1a1a1a] rounded-full flex items-center justify-center shrink-0">
                                <svg
                                    className="w-5 h-5 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={1.5}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.988-1.08a20.454 20.454 0 00-2.012-.072m0 0c-.734 0-1.464.028-2.192.084m4.204-.084V6.75m-4.204-.042A48.2 48.2 0 006.75 6.75"
                                    />
                                </svg>
                            </div>
                            <div>
                                <p className="text-[#1a1a1a] font-medium text-lg">
                                    3–7 Business Days
                                </p>
                                <p className="text-[#8a8a8a] font-light text-sm">
                                    Standard delivery across India
                                </p>
                            </div>
                        </div>
                        <p className="text-[#4a4a4a] font-light leading-relaxed text-sm">
                            Orders are typically dispatched within 1–2 business
                            days after confirmation. You&apos;ll receive a
                            tracking link via email once your order ships.
                        </p>
                    </div>
                </section>

                {/* Section 3 */}
                <section className="mb-12">
                    <h2 className="text-xl font-serif tracking-tight text-[#1a1a1a] mb-4 border-l-2 border-[#c4a8d4] pl-4">
                        Shipping Charges
                    </h2>
                    <p className="text-[#4a4a4a] font-light leading-relaxed">
                        Shipping charges, if applicable, will be clearly
                        displayed at checkout before you confirm your order.
                        Promotional offers may include free shipping — these
                        will be highlighted on our website and applied
                        automatically.
                    </p>
                </section>

                {/* Section 4 */}
                <section className="mb-12">
                    <h2 className="text-xl font-serif tracking-tight text-[#1a1a1a] mb-4 border-l-2 border-[#c4a8d4] pl-4">
                        Order Tracking
                    </h2>
                    <p className="text-[#4a4a4a] font-light leading-relaxed">
                        Once your order has been dispatched, you will receive a
                        confirmation email with tracking details. You can use
                        the tracking link to monitor your shipment in real time.
                        If you haven&apos;t received a tracking update within
                        48 hours of placing your order, please reach out to us.
                    </p>
                </section>

                {/* Section 5 */}
                <section className="mb-12">
                    <h2 className="text-xl font-serif tracking-tight text-[#1a1a1a] mb-4 border-l-2 border-[#c4a8d4] pl-4">
                        Delays &amp; External Factors
                    </h2>
                    <p className="text-[#4a4a4a] font-light leading-relaxed mb-4">
                        While we strive for timely delivery, occasional delays
                        may occur due to circumstances beyond our control,
                        including:
                    </p>
                    <ul className="space-y-2 text-[#4a4a4a] font-light leading-relaxed list-disc list-inside ml-4">
                        <li>
                            Public holidays and regional festivals
                        </li>
                        <li>
                            Weather disruptions or natural events
                        </li>
                        <li>
                            Courier partner delays or logistical issues
                        </li>
                        <li>Remote or hard-to-reach delivery areas</li>
                    </ul>
                    <p className="text-[#4a4a4a] font-light leading-relaxed mt-4">
                        We appreciate your patience in such cases and will
                        always communicate proactively if there&apos;s any
                        significant delay.
                    </p>
                </section>

                {/* Section 6 */}
                <section className="mb-12">
                    <h2 className="text-xl font-serif tracking-tight text-[#1a1a1a] mb-4 border-l-2 border-[#c4a8d4] pl-4">
                        Packaging
                    </h2>
                    <p className="text-[#4a4a4a] font-light leading-relaxed">
                        Every WearAura order is carefully packaged to ensure
                        your fragrance arrives in perfect condition. Our
                        packaging is designed to protect your product during
                        transit while reflecting the premium quality of the
                        brand.
                    </p>
                </section>

                {/* Contact */}
                <div className="bg-[#1a1a1a] p-10 rounded-[4px] mt-16 text-center">
                    <h2 className="text-xl font-serif font-light text-white tracking-wide mb-3">
                        Need Help With Your Shipment?
                    </h2>
                    <p className="text-[#8a8a8a] font-light mb-2">
                        Contact us anytime at
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
