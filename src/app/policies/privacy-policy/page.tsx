import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy — WearAura",
    description:
        "Learn how WearAura collects, uses, and protects your personal information. Your privacy matters to us.",
};

export default function PrivacyPolicyPage() {
    return (
        <main className="min-h-screen bg-[#FAF9F6]">
            {/* Hero */}
            <section className="bg-[#1a1a1a] py-20 border-b border-[#e8e6e1]">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-serif font-light text-[#FAF9F6] tracking-wide mb-4">
                        Privacy Policy
                    </h1>
                    <p className="text-sm text-[#8a8a8a] font-light">
                        Last Updated: March 2026
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-20 max-w-3xl">
                <p className="text-lg text-[#4a4a4a] leading-relaxed mb-12 font-light text-center max-w-2xl mx-auto">
                    At WearAura, your privacy isn&apos;t just a policy — it&apos;s a
                    promise. This page explains what data we collect, why we
                    collect it, and how we keep it safe.
                </p>

                {/* Section 1 */}
                <section className="mb-12">
                    <h2 className="text-xl font-serif tracking-tight text-[#1a1a1a] mb-4 border-l-2 border-[#c4a8d4] pl-4">
                        Information We Collect
                    </h2>
                    <p className="text-[#4a4a4a] font-light leading-relaxed mb-4">
                        When you browse our store, create an account, or place an
                        order, we may collect the following information:
                    </p>
                    <ul className="space-y-2 text-[#4a4a4a] font-light leading-relaxed list-disc list-inside ml-4">
                        <li>Full name</li>
                        <li>Email address</li>
                        <li>Phone number</li>
                        <li>Shipping and billing address</li>
                        <li>Order history and preferences</li>
                        <li>
                            Device and browser information (collected
                            automatically)
                        </li>
                    </ul>
                </section>

                {/* Section 2 */}
                <section className="mb-12">
                    <h2 className="text-xl font-serif tracking-tight text-[#1a1a1a] mb-4 border-l-2 border-[#c4a8d4] pl-4">
                        How We Use Your Data
                    </h2>
                    <p className="text-[#4a4a4a] font-light leading-relaxed mb-4">
                        We use your information solely to enhance your shopping
                        experience:
                    </p>
                    <ul className="space-y-2 text-[#4a4a4a] font-light leading-relaxed list-disc list-inside ml-4">
                        <li>Processing and fulfilling your orders</li>
                        <li>
                            Communicating order updates, shipping notifications,
                            and support responses
                        </li>
                        <li>Personalising your shopping experience</li>
                        <li>
                            Improving our products, website, and customer service
                        </li>
                        <li>
                            Sending promotional communications (only with your
                            consent)
                        </li>
                    </ul>
                </section>

                {/* Section 3 */}
                <section className="mb-12">
                    <h2 className="text-xl font-serif tracking-tight text-[#1a1a1a] mb-4 border-l-2 border-[#c4a8d4] pl-4">
                        Data Sharing
                    </h2>
                    <div className="bg-[#f0eeea] border border-[#e8e6e1] rounded-[4px] p-6">
                        <p className="text-[#4a4a4a] font-light leading-relaxed">
                            <strong className="font-medium text-[#1a1a1a]">
                                We do not sell, trade, or rent your personal
                                information to third parties.
                            </strong>{" "}
                            Your data may only be shared with trusted service
                            providers who assist us in operating our website,
                            processing payments, or delivering orders — and only
                            to the extent necessary to perform those services.
                        </p>
                    </div>
                </section>

                {/* Section 4 */}
                <section className="mb-12">
                    <h2 className="text-xl font-serif tracking-tight text-[#1a1a1a] mb-4 border-l-2 border-[#c4a8d4] pl-4">
                        Cookies
                    </h2>
                    <p className="text-[#4a4a4a] font-light leading-relaxed">
                        Our website uses cookies to improve functionality,
                        remember your preferences, and understand how you
                        interact with our store. You can manage cookie
                        preferences through your browser settings at any time.
                    </p>
                </section>

                {/* Section 5 */}
                <section className="mb-12">
                    <h2 className="text-xl font-serif tracking-tight text-[#1a1a1a] mb-4 border-l-2 border-[#c4a8d4] pl-4">
                        Data Security
                    </h2>
                    <p className="text-[#4a4a4a] font-light leading-relaxed">
                        We take data security seriously. Our platform is built on
                        Supabase — a secure, enterprise-grade backend — and we
                        implement industry-standard encryption and access
                        controls to protect your personal information. While no
                        system is 100% immune to threats, we continually work to
                        safeguard your data.
                    </p>
                </section>

                {/* Section 6 */}
                <section className="mb-12">
                    <h2 className="text-xl font-serif tracking-tight text-[#1a1a1a] mb-4 border-l-2 border-[#c4a8d4] pl-4">
                        Your Rights
                    </h2>
                    <p className="text-[#4a4a4a] font-light leading-relaxed mb-4">
                        You have the right to:
                    </p>
                    <ul className="space-y-2 text-[#4a4a4a] font-light leading-relaxed list-disc list-inside ml-4">
                        <li>Access the personal data we hold about you</li>
                        <li>Request correction of inaccurate information</li>
                        <li>
                            Request deletion of your data (subject to legal
                            obligations)
                        </li>
                        <li>
                            Opt out of promotional communications at any time
                        </li>
                    </ul>
                </section>

                {/* Section 7 */}
                <section className="mb-12">
                    <h2 className="text-xl font-serif tracking-tight text-[#1a1a1a] mb-4 border-l-2 border-[#c4a8d4] pl-4">
                        Changes to This Policy
                    </h2>
                    <p className="text-[#4a4a4a] font-light leading-relaxed">
                        We may update this Privacy Policy from time to time to
                        reflect changes in our practices or applicable laws. Any
                        updates will be posted on this page with a revised
                        &quot;Last Updated&quot; date.
                    </p>
                </section>

                {/* Contact */}
                <div className="bg-[#1a1a1a] p-10 rounded-[4px] mt-16 text-center">
                    <h2 className="text-xl font-serif font-light text-white tracking-wide mb-3">
                        Questions About Your Privacy?
                    </h2>
                    <p className="text-[#8a8a8a] font-light mb-2">
                        Reach out to us anytime at
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
