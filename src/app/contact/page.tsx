"use client";

import { useState } from "react";
import { Mail, Clock, MessageSquare, Send, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

export default function ContactPage() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [inquiryType, setInquiryType] = useState("Bespoke Consultation");
    const [message, setMessage] = useState("");

    const recipientEmail = "wearaurafragrance@gmail.com";

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const fullName = `${firstName} ${lastName}`.trim() || "Valued Client";
        const mailtoSubject = encodeURIComponent(`[${inquiryType}] Inquiry from ${fullName}`);
        const mailtoBody = encodeURIComponent(
            `Hi WearAura Concierge,\n\nName: ${fullName}\nEmail: ${email}\nInquiry Type: ${inquiryType}\n\nMessage:\n${message}\n\nWarm regards,\n${fullName}`
        );

        toast.success("Opening concierge email client...");
        window.location.href = `mailto:${recipientEmail}?subject=${mailtoSubject}&body=${mailtoBody}`;
    };

    return (
        <main className="min-h-screen bg-[#131315] text-[#e5e1e4] pt-12 pb-28 px-6">
            {/* Header Canvas */}
            <div className="w-full max-w-3xl mx-auto flex flex-col items-center text-center mb-16 space-y-4">
                <span className="text-xs font-medium text-[#e8c17b] tracking-[0.3em] uppercase">
                    Client Services
                </span>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-[#e5e1e4]">
                    Seeking Your Personal Aura?
                </h1>
                <p className="text-base md:text-lg text-[#d1c5b4] max-w-2xl font-light leading-relaxed">
                    Our fragrance specialists are at your disposal to guide you towards a scent that matches your distinct profile.
                </p>
            </div>

            {/* Main Grid */}
            <div className="w-full max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Contact Information - Left Col */}
                <div className="md:col-span-5 flex flex-col space-y-6">
                    <div className="glass-card rounded-2xl p-8 md:p-10 space-y-8 h-full relative overflow-hidden group">
                        <div className="space-y-3">
                            <div className="w-10 h-10 rounded-full border border-[#e8c17b]/30 flex items-center justify-center text-[#e8c17b] mb-4">
                                <Sparkles className="w-5 h-5 stroke-[1.5px]" />
                            </div>
                            <h2 className="text-2xl font-serif text-[#e5e1e4]">Bespoke Concierge</h2>
                            <p className="text-sm text-[#d1c5b4] font-light leading-relaxed">
                                For bespoke commissions, olfactory consultation, or order assistance.
                            </p>
                        </div>

                        <div className="space-y-6 pt-4 border-t border-[#9a8f80]/15">
                            {/* Email */}
                            <div className="flex items-start gap-4">
                                <div className="p-2.5 rounded-full bg-[#201f21] text-[#e8c17b] border border-[#9a8f80]/15">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-semibold text-[#9a8f80] uppercase tracking-widest mb-1">
                                        Email Concierge
                                    </p>
                                    <a
                                        className="text-sm font-medium text-[#e5e1e4] hover:text-[#e8c17b] transition-colors"
                                        href={`mailto:${recipientEmail}`}
                                    >
                                        {recipientEmail}
                                    </a>
                                </div>
                            </div>

                            {/* Hours */}
                            <div className="flex items-start gap-4">
                                <div className="p-2.5 rounded-full bg-[#201f21] text-[#e8c17b] border border-[#9a8f80]/15">
                                    <Clock className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-semibold text-[#9a8f80] uppercase tracking-widest mb-1">
                                        Hours of Operation
                                    </p>
                                    <p className="text-sm text-[#e5e1e4] font-light">
                                        Mon – Sat · 10:00 AM – 7:00 PM IST
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 rounded-xl bg-[#201f21]/60 border border-[#9a8f80]/10 text-xs text-[#d1c5b4]/80 font-light leading-relaxed">
                            💬 Inquiries are reviewed by our senior fragrance advisors. Expect a personalized response within a few hours.
                        </div>
                    </div>
                </div>

                {/* Contact Form - Right Col */}
                <div className="md:col-span-7">
                    <div className="glass-card rounded-2xl p-8 md:p-12">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="flex flex-col space-y-1">
                                    <label className="text-[10px] font-semibold text-[#9a8f80] uppercase tracking-widest" htmlFor="firstName">
                                        First Name
                                    </label>
                                    <input
                                        className="form-input text-sm text-[#e5e1e4] placeholder:text-[#d1c5b4]/30"
                                        id="firstName"
                                        placeholder="e.g. Alex"
                                        type="text"
                                        required
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col space-y-1">
                                    <label className="text-[10px] font-semibold text-[#9a8f80] uppercase tracking-widest" htmlFor="lastName">
                                        Last Name
                                    </label>
                                    <input
                                        className="form-input text-sm text-[#e5e1e4] placeholder:text-[#d1c5b4]/30"
                                        id="lastName"
                                        placeholder="e.g. Johnson"
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col space-y-1">
                                <label className="text-[10px] font-semibold text-[#9a8f80] uppercase tracking-widest" htmlFor="email">
                                    Email Address
                                </label>
                                <input
                                    className="form-input text-sm text-[#e5e1e4] placeholder:text-[#d1c5b4]/30"
                                    id="email"
                                    placeholder="your@email.com"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col space-y-1">
                                <label className="text-[10px] font-semibold text-[#9a8f80] uppercase tracking-widest" htmlFor="inquiryType">
                                    Inquiry Type
                                </label>
                                <select
                                    className="form-input text-sm text-[#e5e1e4] bg-[#131315]"
                                    id="inquiryType"
                                    value={inquiryType}
                                    onChange={(e) => setInquiryType(e.target.value)}
                                >
                                    <option value="Bespoke Consultation" className="bg-[#131315] text-[#e5e1e4]">Bespoke Consultation</option>
                                    <option value="Order Assistance" className="bg-[#131315] text-[#e5e1e4]">Order Assistance</option>
                                    <option value="General Inquiry" className="bg-[#131315] text-[#e5e1e4]">General Inquiry</option>
                                </select>
                            </div>

                            <div className="flex flex-col space-y-1">
                                <label className="text-[10px] font-semibold text-[#9a8f80] uppercase tracking-widest" htmlFor="message">
                                    Your Message
                                </label>
                                <textarea
                                    className="form-input text-sm text-[#e5e1e4] resize-none placeholder:text-[#d1c5b4]/30"
                                    id="message"
                                    placeholder="How may our concierge assist you?"
                                    rows={4}
                                    required
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#c9a461] text-[#412d00] px-8 py-4 rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-[#e8c17b] transition-all duration-300 aura-glow mt-4"
                            >
                                <span>Submit Inquiry</span>
                                <Send className="w-3.5 h-3.5" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}
