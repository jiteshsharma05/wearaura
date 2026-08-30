"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, CheckCircle2, Mail, Lock, Sparkles, ArrowRight, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

type SignupMode = "password" | "otp";

export default function SignupPage() {
    const router = useRouter();

    const [mode, setMode] = useState<SignupMode>("password");

    // Password signup states
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // OTP signup states
    const [otpCode, setOtpCode] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("Welcome to WearAura Fragrances");

    // Resend countdown timer
    useEffect(() => {
        if (countdown <= 0) return;
        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [countdown]);

    // Handle Password Signup
    const handleEmailSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error: signUpError } = await supabase.auth.signUp({
                email: email.trim(),
                password,
                options: {
                    data: {
                        full_name: fullName.trim() || undefined,
                    },
                },
            });

            if (signUpError) {
                setError(signUpError.message);
                toast.error(signUpError.message);
            } else {
                setSuccess(true);
                // Check if session was immediately established or confirmation email was sent
                if (data?.session) {
                    setSuccessMessage("Account created! Welcome to WearAura.");
                    toast.success("Account created successfully");
                    setTimeout(() => {
                        router.push("/");
                        router.refresh();
                    }, 1200);
                } else {
                    setSuccessMessage("Account registered! A verification email from WearAura Fragrance has been sent.");
                    toast.success("Please check your email to confirm registration");
                    setTimeout(() => {
                        router.push("/login");
                    }, 2500);
                }
            }
        } catch (err: any) {
            setError(err?.message || "Failed to create account");
        } finally {
            setLoading(false);
        }
    };

    // Handle Send Signup OTP
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
                    data: {
                        full_name: fullName.trim() || undefined,
                    },
                },
            });

            if (otpError) {
                setError(otpError.message);
                toast.error(otpError.message);
            } else {
                setOtpSent(true);
                setCountdown(60);
                toast.success("Verification code sent from WearAura Fragrance!");
            }
        } catch (err: any) {
            setError(err?.message || "Failed to send verification code");
        } finally {
            setLoading(false);
        }
    };

    // Handle Verify Signup OTP
    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!otpCode.trim() || otpCode.trim().length < 6) {
            setError("Please enter the 6-digit code sent to your email");
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
                setSuccessMessage("Welcome! Your WearAura account is verified.");
                setSuccess(true);
                toast.success("Welcome to WearAura Fragrance");
                setTimeout(() => {
                    router.push("/");
                    router.refresh();
                }, 1200);
            }
        } catch (err: any) {
            setError(err?.message || "Failed to verify code");
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
                    {/* Header Tabs */}
                    {!success && (
                        <div className="flex border-b border-[#e8e6e1] bg-[#faf9f6]">
                            <button
                                type="button"
                                onClick={() => { setMode("password"); setError(null); }}
                                className={`flex-1 py-3.5 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                                    mode === "password"
                                        ? "bg-white text-[#1a1a1a] border-b-2 border-[#1a1a1a] shadow-sm"
                                        : "text-[#8a8a8a] hover:text-[#1a1a1a]"
                                }`}
                            >
                                <Lock className="w-3.5 h-3.5" />
                                Password Signup
                            </button>
                            <button
                                type="button"
                                onClick={() => { setMode("otp"); setError(null); }}
                                className={`flex-1 py-3.5 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                                    mode === "otp"
                                        ? "bg-white text-[#1a1a1a] border-b-2 border-[#1a1a1a] shadow-sm"
                                        : "text-[#8a8a8a] hover:text-[#1a1a1a]"
                                }`}
                            >
                                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                                Instant OTP Signup
                            </button>
                        </div>
                    )}

                    <div className="p-7 sm:p-8">
                        {success ? (
                            <div className="flex flex-col items-center py-8 text-center gap-4 animate-in fade-in">
                                <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-1">
                                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-xl font-serif text-[#1a1a1a] mb-1">{successMessage}</p>
                                    <p className="text-sm text-[#8a8a8a]">Preparing your fragrance journey…</p>
                                </div>
                            </div>
                        ) : mode === "password" ? (
                            /* --- PASSWORD SIGNUP FORM --- */
                            <form onSubmit={handleEmailSignup} className="space-y-4">
                                <div>
                                    <p className="text-xl font-serif text-[#1a1a1a] mb-1">Create Account</p>
                                    <p className="text-xs text-[#8a8a8a]">Register with your email and choose a secure password</p>
                                </div>

                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-[6px] text-xs font-medium">
                                        {error}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-xs font-semibold text-[#4a4a4a] uppercase tracking-wider mb-1.5" htmlFor="signup-name">
                                        Full Name (Optional)
                                    </label>
                                    <input
                                        id="signup-name"
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="e.g. Eleanor Vance"
                                        className="w-full border border-[#e8e6e1] rounded-[6px] px-3.5 py-2.5 text-sm text-[#1a1a1a] placeholder-[#b5b2ac] focus:outline-none focus:ring-1 focus:ring-[#1a1a1a] focus:border-[#1a1a1a] transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-[#4a4a4a] uppercase tracking-wider mb-1.5" htmlFor="signup-email">
                                        Email Address
                                    </label>
                                    <input
                                        id="signup-email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => { setEmail(e.target.value); setError(null); }}
                                        required
                                        placeholder="you@example.com"
                                        className="w-full border border-[#e8e6e1] rounded-[6px] px-3.5 py-2.5 text-sm text-[#1a1a1a] placeholder-[#b5b2ac] focus:outline-none focus:ring-1 focus:ring-[#1a1a1a] focus:border-[#1a1a1a] transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-[#4a4a4a] uppercase tracking-wider mb-1.5" htmlFor="signup-password">
                                        Create Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="signup-password"
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => { setPassword(e.target.value); setError(null); }}
                                            required
                                            minLength={6}
                                            placeholder="Minimum 6 characters"
                                            className="w-full border border-[#e8e6e1] rounded-[6px] px-3.5 py-2.5 pr-10 text-sm text-[#1a1a1a] placeholder-[#b5b2ac] focus:outline-none focus:ring-1 focus:ring-[#1a1a1a] focus:border-[#1a1a1a] transition"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((v) => !v)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a8a8a] hover:text-[#1a1a1a] p-1"
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    <p className="text-[11px] text-[#8a8a8a] mt-1">Must be at least 6 characters</p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3.5 rounded-[6px] bg-[#1a1a1a] text-white text-sm font-medium hover:bg-[#333] disabled:bg-[#a0a0a0] disabled:cursor-not-allowed transition-all shadow-sm active:scale-[0.99] mt-2"
                                >
                                    {loading ? "Creating Account…" : "Create Account"}
                                </button>
                            </form>
                        ) : (
                            /* --- OTP SIGNUP FORM --- */
                            <div className="space-y-5">
                                <div>
                                    <p className="text-xl font-serif text-[#1a1a1a] mb-1">
                                        {!otpSent ? "Instant Signup with OTP" : "Enter Verification Code"}
                                    </p>
                                    <p className="text-xs text-[#8a8a8a]">
                                        {!otpSent
                                            ? "No password needed. Receive a one-time code to create your account instantly."
                                            : `We've sent a 6-digit code to ${email}. Check your email inbox.`}
                                    </p>
                                </div>

                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-[6px] text-xs font-medium">
                                        {error}
                                    </div>
                                )}

                                {!otpSent ? (
                                    <form onSubmit={handleSendOtp} className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-[#4a4a4a] uppercase tracking-wider mb-1.5" htmlFor="otp-signup-name">
                                                Full Name (Optional)
                                            </label>
                                            <input
                                                id="otp-signup-name"
                                                type="text"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                placeholder="e.g. Eleanor Vance"
                                                className="w-full border border-[#e8e6e1] rounded-[6px] px-3.5 py-2.5 text-sm text-[#1a1a1a] placeholder-[#b5b2ac] focus:outline-none focus:ring-1 focus:ring-[#1a1a1a] focus:border-[#1a1a1a] transition"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-[#4a4a4a] uppercase tracking-wider mb-1.5" htmlFor="otp-signup-email">
                                                Email Address
                                            </label>
                                            <input
                                                id="otp-signup-email"
                                                type="email"
                                                value={email}
                                                onChange={(e) => { setEmail(e.target.value); setError(null); }}
                                                required
                                                placeholder="you@example.com"
                                                className="w-full border border-[#e8e6e1] rounded-[6px] px-3.5 py-2.5 text-sm text-[#1a1a1a] placeholder-[#b5b2ac] focus:outline-none focus:ring-1 focus:ring-[#1a1a1a] focus:border-[#1a1a1a] transition"
                                            />
                                        </div>

                                        <div className="p-3 bg-[#faf9f6] rounded-[6px] border border-[#e8e6e1] text-xs text-[#6a6a6a] space-y-1">
                                            <p className="font-medium text-[#1a1a1a] flex items-center gap-1.5">
                                                <Mail className="w-3.5 h-3.5 text-[#8a8a8a]" />
                                                WearAura Fragrance Notification:
                                            </p>
                                            <p>A verification code will be sent to your email from <strong>WearAura Fragrance</strong>.</p>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full py-3.5 rounded-[6px] bg-[#1a1a1a] text-white text-sm font-medium hover:bg-[#333] disabled:bg-[#a0a0a0] disabled:cursor-not-allowed transition-all shadow-sm active:scale-[0.99] flex items-center justify-center gap-2"
                                        >
                                            {loading ? "Sending Code…" : "Send Verification Code"}
                                            {!loading && <ArrowRight className="w-4 h-4" />}
                                        </button>
                                    </form>
                                ) : (
                                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-[#4a4a4a] uppercase tracking-wider mb-1.5" htmlFor="otp-signup-code">
                                                6-Digit Verification Code
                                            </label>
                                            <input
                                                id="otp-signup-code"
                                                type="text"
                                                maxLength={6}
                                                value={otpCode}
                                                onChange={(e) => {
                                                    const val = e.target.value.replace(/\D/g, "");
                                                    setOtpCode(val);
                                                    setError(null);
                                                }}
                                                required
                                                placeholder="123456"
                                                className="w-full border border-[#e8e6e1] rounded-[6px] px-3.5 py-3 text-center text-2xl tracking-[0.35em] font-mono text-[#1a1a1a] placeholder-[#c0bdb8] focus:outline-none focus:ring-2 focus:ring-[#1a1a1a] transition"
                                                autoFocus
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loading || otpCode.length < 6}
                                            className="w-full py-3.5 rounded-[6px] bg-[#1a1a1a] text-white text-sm font-medium hover:bg-[#333] disabled:bg-[#a0a0a0] disabled:cursor-not-allowed transition-all shadow-sm active:scale-[0.99]"
                                        >
                                            {loading ? "Creating Account…" : "Verify & Create Account"}
                                        </button>

                                        <div className="flex items-center justify-between text-xs pt-1">
                                            <button
                                                type="button"
                                                onClick={() => { setOtpSent(false); setOtpCode(""); }}
                                                className="text-[#6a6a6a] hover:text-[#1a1a1a] underline"
                                            >
                                                Change Email
                                            </button>

                                            <button
                                                type="button"
                                                disabled={countdown > 0 || loading}
                                                onClick={handleSendOtp}
                                                className="text-[#1a1a1a] font-medium hover:underline disabled:text-[#a0a0a0] disabled:no-underline flex items-center gap-1"
                                            >
                                                <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
                                                {countdown > 0 ? `Resend in ${countdown}s` : "Resend Code"}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        )}
                    </div>

                    {!success && (
                        <div className="px-7 py-4 border-t border-[#e8e6e1] bg-[#faf9f6] text-center">
                            <p className="text-xs text-[#8a8a8a]">
                                Already have a WearAura account?{" "}
                                <Link href="/login" className="text-[#1a1a1a] font-semibold hover:underline">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
