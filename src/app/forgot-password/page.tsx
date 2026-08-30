"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import Link from "next/link";
import { ArrowLeft, Mail, KeyRound, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Send Reset Link
    const handleResetRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) {
            setError("Please enter your email address");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const redirectUrl = typeof window !== "undefined"
                ? `${window.location.origin}/reset-password`
                : "https://wearaura.com/reset-password";

            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
                redirectTo: redirectUrl,
            });

            if (resetError) {
                setError(resetError.message);
                toast.error(resetError.message);
            } else {
                setSent(true);
                toast.success("Password reset instructions sent from WearAura Fragrance!");
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to send reset link");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#FAF9F6] flex items-center justify-center px-4 py-16 font-sans text-[#1a1a1a]">
            <div className="w-full max-w-[440px]">
                {/* Brand Logo & Name */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block font-serif text-[32px] text-[#1a1a1a] tracking-wider">
                        WearAura
                    </Link>
                    <p className="text-xs uppercase tracking-[0.25em] text-[#8a8a8a] mt-1 font-sans">
                        Luxury Fragrances
                    </p>
                </div>

                <div className="bg-white border border-[#e8e6e1] rounded-[12px] shadow-sm overflow-hidden">
                    <div className="p-7 sm:p-8">
                        <div className="mb-6">
                            <Link
                                href="/login"
                                className="inline-flex items-center text-xs font-semibold text-[#8a8a8a] hover:text-[#1a1a1a] transition-colors gap-1.5 uppercase tracking-wider"
                            >
                                <ArrowLeft className="w-3.5 h-3.5" />
                                Back to Sign In
                            </Link>
                        </div>

                        {sent ? (
                            <div className="flex flex-col items-center py-6 text-center gap-4 animate-in fade-in">
                                <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-1">
                                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                                </div>

                                <div>
                                    <h1 className="text-xl font-serif text-[#1a1a1a] mb-2">Reset Link Dispatched</h1>
                                    <p className="text-xs text-[#6a6a6a] leading-relaxed mb-4">
                                        We have sent password reset instructions to <strong>{email}</strong>.
                                    </p>
                                    <div className="p-3.5 bg-[#faf9f6] border border-[#e8e6e1] rounded-[6px] text-xs text-[#6a6a6a] text-left space-y-1.5">
                                        <p className="font-semibold text-[#1a1a1a] flex items-center gap-1.5">
                                            <Mail className="w-3.5 h-3.5 text-[#8a8a8a]" />
                                            Sender: WearAura Fragrance
                                        </p>
                                        <p>Please check your inbox (and spam or promotions folder) for an email from <strong>WearAura Fragrance</strong>.</p>
                                    </div>
                                </div>

                                <div className="w-full space-y-2 pt-4">
                                    <Link
                                        href="/login"
                                        className="w-full inline-block py-3 rounded-[6px] bg-[#1a1a1a] text-white text-xs font-medium uppercase tracking-wider hover:bg-[#333] transition-colors text-center"
                                    >
                                        Return to Sign In
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => { setSent(false); }}
                                        className="w-full text-xs text-[#8a8a8a] hover:text-[#1a1a1a] py-2"
                                    >
                                        Try another email address
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div>
                                    <h1 className="text-xl font-serif text-[#1a1a1a] mb-1">Forgot Password</h1>
                                    <p className="text-xs text-[#8a8a8a] leading-relaxed">
                                        Choose how you&apos;d like to access your WearAura account
                                    </p>
                                </div>

                                {/* Option 1: Instant OTP Login (No reset needed) */}
                                <div className="p-4 rounded-[8px] bg-gradient-to-br from-[#faf9f6] to-[#f4f2ed] border border-[#e2ded6]">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-white rounded-full border border-[#e8e6e1] shadow-xs text-[#1a1a1a]">
                                            <KeyRound className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-semibold text-[#1a1a1a]">Fastest Option: Sign in with OTP</p>
                                            <p className="text-[11px] text-[#6a6a6a] mt-0.5 mb-2.5">
                                                Receive a 6-digit code to log in immediately without changing your password.
                                            </p>
                                            <Link
                                                href="/login"
                                                className="inline-flex items-center text-xs font-semibold text-[#1a1a1a] underline underline-offset-4 hover:text-[#4a4a4a]"
                                            >
                                                Sign in using OTP code →
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative flex py-1 items-center">
                                    <div className="flex-grow border-t border-[#e8e6e1]"></div>
                                    <span className="flex-shrink mx-3 text-[10px] uppercase tracking-widest text-[#a0a0a0]">or reset password</span>
                                    <div className="flex-grow border-t border-[#e8e6e1]"></div>
                                </div>

                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-[6px] text-xs font-medium">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleResetRequest} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-[#4a4a4a] uppercase tracking-wider mb-1.5" htmlFor="reset-email">
                                            Registered Email Address
                                        </label>
                                        <input
                                            id="reset-email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => { setEmail(e.target.value); setError(null); }}
                                            required
                                            placeholder="you@example.com"
                                            className="w-full border border-[#e8e6e1] rounded-[6px] px-3.5 py-3 text-sm text-[#1a1a1a] placeholder-[#b5b2ac] focus:outline-none focus:ring-1 focus:ring-[#1a1a1a] focus:border-[#1a1a1a] transition"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-3.5 rounded-[6px] bg-[#1a1a1a] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#333] disabled:bg-[#a0a0a0] disabled:cursor-not-allowed transition-all shadow-sm active:scale-[0.99]"
                                    >
                                        {loading ? "Sending Reset Link…" : "Send Password Reset Link"}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
