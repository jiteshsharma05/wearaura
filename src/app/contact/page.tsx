"use client";

import { useState } from "react";

export default function ContactPage() {
    const [name, setName] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");

    const recipientEmail = "wearaurafragrance@gmail.com";

    const handleEmailRedirect = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const mailtoSubject = subject ? encodeURIComponent(subject) : encodeURIComponent("Inquiry from WearAura Website");
        const mailtoBody = encodeURIComponent(
            `Hi WearAura Team,\n\nMy name is ${name || "a customer"}.\n\n${message}\n\nBest regards,\n${name || ""}`
        );

        window.location.href = `mailto:${recipientEmail}?subject=${mailtoSubject}&body=${mailtoBody}`;
    };

    return (
        <main className="min-h-screen bg-[#FAF9F6]">
            {/* Header */}
            <section className="bg-[#1a1a1a] py-20 border-b border-[#e8e6e1]">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-serif font-light text-[#FAF9F6] tracking-wide mb-4">
                        Get in Touch
                    </h1>
                    <p className="text-lg text-[#8a8a8a] font-light max-w-xl mx-auto">
                        Have a question or a fragrance enquiry? We&apos;d love to hear from you.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-20 max-w-2xl">

                {/* Email info card */}
                <div className="flex items-start gap-5 bg-[#f0eeea] border border-[#e8e6e1] rounded-[4px] p-6 mb-10">
                    <div className="w-12 h-12 bg-[#1a1a1a] rounded-full flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold uppercase tracking-widest text-[#1a1a1a] mb-1">Email Us</h2>
                        <a
                            href={`mailto:${recipientEmail}`}
                            className="text-[#4a4a4a] hover:text-[#1a1a1a] font-light transition-colors underline underline-offset-4 decoration-[#e8e6e1] hover:decoration-[#1a1a1a]"
                        >
                            {recipientEmail}
                        </a>
                        <p className="text-xs text-[#8a8a8a] mt-2 italic font-light">
                            We typically respond within a few hours.
                        </p>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-white border border-[#e8e6e1] rounded-[4px] p-8 shadow-sm">
                    <h2 className="text-xl font-serif text-[#1a1a1a] mb-2 tracking-wide">Send a Message</h2>
                    <p className="text-sm text-[#8a8a8a] font-light mb-8">
                        Fill in the details below and click &quot;Send Email&quot; — your default email app will open with everything pre-filled.
                    </p>

                    <form onSubmit={handleEmailRedirect} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="name" className="block text-sm font-medium text-[#4a4a4a]">
                                Your Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder="e.g. Alex Johnson"
                                className="w-full px-4 py-3 border border-[#e8e6e1] bg-[#FAF9F6] text-[#1a1a1a] rounded-[2px] focus:ring-1 focus:ring-[#1a1a1a] focus:border-[#1a1a1a] focus:outline-none transition-shadow placeholder:text-[#c4c0bb] text-sm font-sans"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="subject" className="block text-sm font-medium text-[#4a4a4a]">
                                Subject
                            </label>
                            <input
                                type="text"
                                id="subject"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="e.g. Order Inquiry, Fragrance Question..."
                                className="w-full px-4 py-3 border border-[#e8e6e1] bg-[#FAF9F6] text-[#1a1a1a] rounded-[2px] focus:ring-1 focus:ring-[#1a1a1a] focus:border-[#1a1a1a] focus:outline-none transition-shadow placeholder:text-[#c4c0bb] text-sm font-sans"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="message" className="block text-sm font-medium text-[#4a4a4a]">
                                Message
                            </label>
                            <textarea
                                id="message"
                                rows={6}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                                placeholder="Describe your inquiry or question..."
                                className="w-full px-4 py-3 border border-[#e8e6e1] bg-[#FAF9F6] text-[#1a1a1a] rounded-[2px] focus:ring-1 focus:ring-[#1a1a1a] focus:border-[#1a1a1a] focus:outline-none transition-shadow resize-none placeholder:text-[#c4c0bb] text-sm font-sans"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 bg-[#1a1a1a] hover:bg-[#333] text-white font-medium text-sm rounded-[2px] transition-colors flex items-center justify-center gap-2 tracking-wide"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                            </svg>
                            Send Email
                        </button>
                    </form>

                    <p className="text-xs text-center text-[#8a8a8a] mt-6 font-light">
                        Clicking &quot;Send Email&quot; will open your email client. You&apos;ll be emailing{" "}
                        <span className="font-medium text-[#4a4a4a]">{recipientEmail}</span>
                    </p>
                </div>

                {/* Response time note */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-[#8a8a8a] font-light">
                        💬 Our team is available and responsive. You can expect a reply within a few hours during business hours.
                    </p>
                </div>
            </div>
        </main>
    );
}
