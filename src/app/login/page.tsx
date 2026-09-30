"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Mail, KeyRound, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
    const router = useRouter();

    // OTP states
    const [email, setEmail] = useState("");
    const [otpCode, setOtpCode] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("Welcome back to WearAura");

    // Resend countdown timer
    useEffect(() => {
        if (countdown <= 0) return;
        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [countdown]);

    // Handle Send OTP
    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) {
            setError("Please enter your email address");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { error: otpError } = await supabase.auth.signInWithOtp({
                email: email.trim(),
                options: {
                    shouldCreateUser: true,
                },
            });

            if (otpError) {
                setError(otpError.message);
                toast.error(otpError.message);
            } else {
                setOtpSent(true);
                setCountdown(60);
                toast.success("Verification code sent to your email!");
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to send verification code");
        } finally {
            setLoading(false);
        }
    };

    // Handle Verify OTP
    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!otpCode.trim()) {
            setError("Please enter the 6-digit code");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { error: verifyError } = await supabase.auth.verifyOtp({
                email: email.trim(),
                token: otpCode.trim(),
                type: "email",
            });

            if (verifyError) {
                setError(verifyError.message);
                toast.error(verifyError.message);
            } else {
                setSuccessMessage("Verification successful! Welcome back.");
                setSuccess(true);
                toast.success("Signed in successfully");
                setTimeout(() => {
                    router.push("/");
                    router.refresh();
                }, 1200);
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to verify code");
        } finally {
            setLoading(false);
        }
    };

    // Handle Google OAuth Login
    const handleGoogleLogin = async () => {
        setLoading(true);
        setError(null);
        try {
            const redirectTo = typeof window !== "undefined" ? `${window.location.origin}/` : undefined;
            const { error: googleError } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo,
                },
            });
            if (googleError) {
                setError(googleError.message);
                toast.error(googleError.message);
                setLoading(false);
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to initiate Google sign in");
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#131315] text-[#e5e1e4] flex items-center justify-center py-24 px-6 relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-radial from-[#e8c17b]/10 to-transparent blur-3xl pointer-events-none" />

            <div className="w-full max-w-md relative z-10">
                {/* Brand Header */}
                <div className="text-center mb-8 space-y-2">
                    <Link href="/" className="inline-block group">
                        <span className="text-xs uppercase tracking-[0.3em] text-[#e8c17b] font-medium block">
                            Haute Parfumerie
                        </span>
                        <h1 className="text-3xl sm:text-4xl font-serif text-[#e5e1e4] tracking-wide mt-1">
                            WearAura
                        </h1>
                    </Link>
                    <p className="text-xs text-[#d1c5b4]/80 tracking-widest uppercase">
                        Client Boutique Portal
                    </p>
                </div>

                {/* Main Glass Card */}
                <div className="glass-card rounded-2xl overflow-hidden border border-[#9a8f80]/15 shadow-2xl">
                    {/* Header bar (Single mode — Email Code) */}
                    {!success && (
                        <div className="flex border-b border-[#9a8f80]/15 bg-[#0e0e10]/60">
                            <div className="flex-1 py-4 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 bg-[#201f21] text-[#e8c17b] border-b-2 border-[#e8c17b]">
                                <KeyRound className="w-3.5 h-3.5" />
                                Email Code
                            </div>
                        </div>
                    )}

                    <div className="p-8">
                        {success ? (
                            <div className="flex flex-col items-center py-8 text-center gap-4 animate-in fade-in">
                                <div className="w-16 h-16 bg-[#003731]/40 text-[#3cddc7] border border-[#3cddc7]/30 rounded-full flex items-center justify-center mb-1">
                                    <CheckCircle2 className="w-8 h-8" />
                                </div>
                                <div>
                                    <p className="text-2xl font-serif text-[#e5e1e4] mb-2">{successMessage}</p>
                                    <p className="text-xs text-[#d1c5b4]/70 tracking-widest uppercase">Entering your sanctuary…</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Google Sign-In Button */}
                                <div>
                                    <button
                                        type="button"
                                        onClick={handleGoogleLogin}
                                        disabled={loading}
                                        className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl border border-[#9a8f80]/20 bg-[#201f21]/80 hover:bg-[#2a2a2c] hover:border-[#e8c17b]/40 text-[#e5e1e4] text-xs uppercase tracking-wider font-semibold transition-all shadow-sm active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                                    >
                                        <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                                            <path
                                                fill="#4285F4"
                                                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                                            />
                                            <path
                                                fill="#34A853"
                                                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
                                            />
                                            <path
                                                fill="#FBBC05"
                                                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                                            />
                                            <path
                                                fill="#EA4335"
                                                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                                            />
                                        </svg>
                                        <span>Continue with Google</span>
                                    </button>
                                </div>

                                <div className="relative flex items-center justify-center my-4">
                                    <div className="border-t border-[#9a8f80]/15 w-full" />
                                    <span className="bg-[#16151A] px-3 text-[10px] font-semibold text-[#9a8f80] uppercase tracking-widest absolute">
                                        or continue with email code
                                    </span>
                                </div>

                                {/* --- OTP LOGIN FORM --- */}
                                <div className="space-y-5">
                                    {error && (
                                        <div className="bg-[#690005]/40 border border-[#ffb4ab]/30 text-[#ffb4ab] p-3.5 rounded-xl text-xs">
                                            {error}
                                        </div>
                                    )}

                                    {!otpSent ? (
                                        <form onSubmit={handleSendOtp} className="space-y-5">
                                            <div>
                                                <label className="block text-[10px] font-semibold text-[#9a8f80] uppercase tracking-widest mb-1.5" htmlFor="otp-email">
                                                    Email Address
                                                </label>
                                                <input
                                                    id="otp-email"
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => { setEmail(e.target.value); setError(null); }}
                                                    required
                                                    placeholder="client@wearaura.com"
                                                    className="form-input text-sm text-[#e5e1e4] placeholder:text-[#d1c5b4]/30"
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full inline-flex items-center justify-center gap-2 py-4 bg-[#c9a461] text-[#412d00] text-xs font-semibold uppercase tracking-widest rounded-full hover:bg-[#e8c17b] transition-all duration-300 aura-glow disabled:opacity-50 mt-2"
                                            >
                                                {loading ? "Sending Code…" : "Send Verification Code"}
                                                {!loading && <Mail className="w-4 h-4" />}
                                            </button>
                                        </form>
                                    ) : (
                                        <form onSubmit={handleVerifyOtp} className="space-y-5">
                                            <div className="p-4 rounded-xl bg-[#201f21] border border-[#9a8f80]/15 text-xs text-[#d1c5b4] flex items-center justify-between">
                                                <span className="truncate">{email}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => { setOtpSent(false); setOtpCode(""); }}
                                                    className="text-[#e8c17b] hover:underline text-[11px] font-medium ml-2 shrink-0"
                                                >
                                                    Change
                                                </button>
                                            </div>

                                            <div>
                                                <label className="block text-[10px] font-semibold text-[#9a8f80] uppercase tracking-widest mb-1.5" htmlFor="otp-code">
                                                    6-Digit Verification Code
                                                </label>
                                                <input
                                                    id="otp-code"
                                                    type="text"
                                                    value={otpCode}
                                                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                                    required
                                                    placeholder="123456"
                                                    className="form-input text-center text-xl tracking-[0.4em] font-mono text-[#e8c17b]"
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={loading || otpCode.length < 6}
                                                className="w-full inline-flex items-center justify-center gap-2 py-4 bg-[#c9a461] text-[#412d00] text-xs font-semibold uppercase tracking-widest rounded-full hover:bg-[#e8c17b] transition-all duration-300 aura-glow disabled:opacity-50"
                                            >
                                                {loading ? "Verifying…" : "Confirm & Sign In"}
                                            </button>

                                            <div className="text-center pt-2">
                                                {countdown > 0 ? (
                                                    <span className="text-xs text-[#9a8f80]">
                                                        Resend code in {countdown}s
                                                    </span>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={handleSendOtp}
                                                        className="text-xs text-[#e8c17b] hover:underline inline-flex items-center gap-1"
                                                    >
                                                        <RefreshCw className="w-3 h-3" /> Resend Code
                                                    </button>
                                                )}
                                            </div>
                                        </form>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Bottom Registration Link */}
                    <div className="p-6 bg-[#0e0e10]/60 border-t border-[#9a8f80]/15 text-center text-xs text-[#d1c5b4]/80">
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" className="text-[#e8c17b] hover:underline font-medium">
                            Create an Account
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
