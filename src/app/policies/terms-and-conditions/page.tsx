import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms & Conditions — WearAura",
    description:
        "Read the terms and conditions governing your use of the WearAura website and services.",
};

export default function TermsAndConditionsPage() {
    return (
        <main className="min-h-screen bg-[#FAF9F6]">
            {/* Hero */}
            <section className="bg-[#1a1a1a] py-20 border-b border-[#e8e6e1]">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-serif font-light text-[#FAF9F6] tracking-wide mb-4">
                        Terms &amp; Conditions
                    </h1>
                    <p className="text-sm text-[#8a8a8a] font-light">
                        Last Updated: March 2026
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-20 max-w-3xl">
                <p className="text-lg text-[#4a4a4a] leading-relaxed mb-12 font-light text-center max-w-2xl mx-auto">
                    By accessing or using the WearAura website, you agree to
                    the following terms. Please read them carefully before
                    making a purchase or creating an account.
                </p>

                {/* Section 1 */}
                <section className="mb-12">
                    <h2 className="text-xl font-serif tracking-tight text-[#1a1a1a] mb-4 border-l-2 border-[#c4a8d4] pl-4">
                        General Overview
                    </h2>
                    <p className="text-[#4a4a4a] font-light leading-relaxed">
                        WearAura is a premium online fragrance store operated
                        within India. These terms apply to all visitors, users,
                        and customers of the website. By using our services, you
                        confirm that you are at least 18 years of age or are
                        accessing the site under the supervision of a parent or
                        guardian.
                    </p>
                </section>

                {/* Section 2 */}
                <section className="mb-12">
                    <h2 className="text-xl font-serif tracking-tight text-[#1a1a1a] mb-4 border-l-2 border-[#c4a8d4] pl-4">
                        Account Responsibility
                    </h2>
                    <p className="text-[#4a4a4a] font-light leading-relaxed mb-4">
                        When you create an account on WearAura, you are
                        responsible for:
                    </p>
                    <ul className="space-y-2 text-[#4a4a4a] font-light leading-relaxed list-disc list-inside ml-4">
                        <li>
                            Providing accurate, current, and complete
                            information
                        </li>
                        <li>
                            Maintaining the confidentiality of your login
                            credentials
                        </li>
                        <li>
                            All activities that occur under your account
                        </li>
                    </ul>
                    <p className="text-[#4a4a4a] font-light leading-relaxed mt-4">
                        If you suspect unauthorised access to your account,
                        please contact us immediately.
                    </p>
                </section>

                {/* Section 3 */}
                <section className="mb-12">
                    <h2 className="text-xl font-serif tracking-tight text-[#1a1a1a] mb-4 border-l-2 border-[#c4a8d4] pl-4">
                        Pricing &amp; Availability
                    </h2>
                    <p className="text-[#4a4a4a] font-light leading-relaxed">
                        All prices displayed on the website are in Indian Rupees
                        (₹) and are inclusive of applicable taxes unless stated
                        otherwise. We reserve the right to modify prices at any
                        time without prior notice. In the unlikely event of a
                        pricing error, we will notify you and offer the option
                        to proceed or cancel your order.
                    </p>
                </section>

                {/* Section 4 */}
                <section className="mb-12">
                    <h2 className="text-xl font-serif tracking-tight text-[#1a1a1a] mb-4 border-l-2 border-[#c4a8d4] pl-4">
                        Orders &amp; Payments
                    </h2>
                    <p className="text-[#4a4a4a] font-light leading-relaxed mb-4">
                        Placing an order on WearAura constitutes an offer to
                        purchase. We reserve the right to accept or decline any
                        order for any reason, including but not limited to:
                    </p>
                    <ul className="space-y-2 text-[#4a4a4a] font-light leading-relaxed list-disc list-inside ml-4">
                        <li>Product unavailability or stock limitations</li>
                        <li>
                            Errors in product information, pricing, or
                            descriptions
                        </li>
                        <li>Suspected fraudulent activity</li>
                    </ul>
                    <p className="text-[#4a4a4a] font-light leading-relaxed mt-4">
                        Currently, we support Cash on Delivery (COD) as our
                        primary payment method. Additional payment options may
                        be introduced in the future.
                    </p>
                </section>

                {/* Section 5 */}
                <section className="mb-12">
                    <h2 className="text-xl font-serif tracking-tight text-[#1a1a1a] mb-4 border-l-2 border-[#c4a8d4] pl-4">
                        Intellectual Property
                    </h2>
                    <div className="bg-[#f0eeea] border border-[#e8e6e1] rounded-[4px] p-6">
                        <p className="text-[#4a4a4a] font-light leading-relaxed">
                            All content on the WearAura website — including but
                            not limited to the brand name, logo, product images,
                            descriptions, copy, graphics, and design — is the
                            intellectual property of WearAura and is protected
                            by applicable copyright and trademark laws.
                            Reproduction, distribution, or use of any content
                            without prior written permission is strictly
                            prohibited.
                        </p>
                    </div>
                </section>

                {/* Section 6 */}
                <section className="mb-12">
                    <h2 className="text-xl font-serif tracking-tight text-[#1a1a1a] mb-4 border-l-2 border-[#c4a8d4] pl-4">
                        User Conduct
                    </h2>
                    <p className="text-[#4a4a4a] font-light leading-relaxed mb-4">
                        You agree not to use the WearAura website for any
                        unlawful purpose or in a way that could damage,
                        disable, or impair the website. This includes, but is
                        not limited to:
                    </p>
                    <ul className="space-y-2 text-[#4a4a4a] font-light leading-relaxed list-disc list-inside ml-4">
                        <li>
                            Attempting to gain unauthorised access to our
                            systems
                        </li>
                        <li>
                            Submitting false or misleading information
                        </li>
                        <li>
                            Using automated tools to scrape or harvest data
                        </li>
                    </ul>
                </section>

                {/* Section 7 */}
                <section className="mb-12">
                    <h2 className="text-xl font-serif tracking-tight text-[#1a1a1a] mb-4 border-l-2 border-[#c4a8d4] pl-4">
                        Limitation of Liability
                    </h2>
                    <p className="text-[#4a4a4a] font-light leading-relaxed">
                        WearAura shall not be held liable for any indirect,
                        incidental, or consequential damages arising from the
                        use of our website or products. Our total liability for
                        any claim shall not exceed the amount paid by you for
                        the specific product in question.
                    </p>
                </section>

                {/* Section 8 */}
                <section className="mb-12">
                    <h2 className="text-xl font-serif tracking-tight text-[#1a1a1a] mb-4 border-l-2 border-[#c4a8d4] pl-4">
                        Changes to These Terms
                    </h2>
                    <p className="text-[#4a4a4a] font-light leading-relaxed">
                        We may revise these Terms &amp; Conditions at any time.
                        Updated terms will be posted on this page with a
                        revised &quot;Last Updated&quot; date. Continued use of
                        the website after changes constitutes acceptance of the
                        revised terms.
                    </p>
                </section>

                {/* Contact */}
                <div className="bg-[#1a1a1a] p-10 rounded-[4px] mt-16 text-center">
                    <h2 className="text-xl font-serif font-light text-white tracking-wide mb-3">
                        Have Questions About Our Terms?
                    </h2>
                    <p className="text-[#8a8a8a] font-light mb-2">
                        We&apos;re happy to clarify — reach us at
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
