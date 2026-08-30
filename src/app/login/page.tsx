"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, CheckCircle2, Mail, Lock, KeyRound, ArrowRight, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

type AuthMode = "password" | "otp";

export default function LoginPage() {
    const router = useRouter();

    const [mode, setMode] = useState<AuthMode>("password");

    // Form states
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // OTP states
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

    // Handle Password Login
    const handlePasswordLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password,
            });

            if (signInError) {
                setError(signInError.message);
                toast.error(signInError.message);
            } else {
                setSuccessMessage("Welcome back! You're signed in.");
                setSuccess(true);
                toast.success("Signed in successfully");
                setTimeout(() => {
                    router.push("/");
                    router.refresh();
                }, 1200);
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to sign in");
        } finally {
            setLoading(false);
        }
    };

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
                    shouldCreateUser: true, // Allows seamless login or signup via OTP
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
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to send verification code");
        } finally {
            setLoading(false);
        }
    };

    // Handle Verify OTP
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
                setSuccessMessage("Code verified! Signing you in...");
                setSuccess(true);
                toast.success("Welcome to WearAura Fragrance");
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
                                Password
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
                                <KeyRound className="w-3.5 h-3.5" />
                                Sign in with OTP
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
                                    <p className="text-sm text-[#8a8a8a]">Redirecting to your boutique…</p>
                                </div>
                            </div>
                        ) : mode === "password" ? (
                            /* --- PASSWORD LOGIN FORM --- */
                            <form onSubmit={handlePasswordLogin} className="space-y-5">
                                <div>
                                    <p className="text-xl font-serif text-[#1a1a1a] mb-1">Sign in</p>
                                    <p className="text-xs text-[#8a8a8a]">Enter your email and password to access your account</p>
                                </div>

                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-[6px] text-xs font-medium">
                                        {error}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-xs font-semibold text-[#4a4a4a] uppercase tracking-wider mb-1.5" htmlFor="login-email">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="login-email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => { setEmail(e.target.value); setError(null); }}
                                            required
                                            placeholder="you@example.com"
                                            className="w-full border border-[#e8e6e1] rounded-[6px] px-3.5 py-3 text-sm text-[#1a1a1a] placeholder-[#b5b2ac] focus:outline-none focus:ring-1 focus:ring-[#1a1a1a] focus:border-[#1a1a1a] transition"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-1.5">
                                        <label className="text-xs font-semibold text-[#4a4a4a] uppercase tracking-wider" htmlFor="login-password">
                                            Password
                                        </label>
                                        <Link href="/forgot-password" className="text-xs text-[#8a8a8a] hover:text-[#1a1a1a] transition-colors underline-offset-2 hover:underline">
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <div className="relative">
                                        <input
                                            id="login-password"
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => { setPassword(e.target.value); setError(null); }}
                                            required
                                            placeholder="••••••••"
                                            className="w-full border border-[#e8e6e1] rounded-[6px] px-3.5 py-3 pr-10 text-sm text-[#1a1a1a] placeholder-[#b5b2ac] focus:outline-none focus:ring-1 focus:ring-[#1a1a1a] focus:border-[#1a1a1a] transition"
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
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3.5 rounded-[6px] bg-[#1a1a1a] text-white text-sm font-medium hover:bg-[#333] disabled:bg-[#a0a0a0] disabled:cursor-not-allowed transition-all shadow-sm active:scale-[0.99]"
                                >
                                    {loading ? "Signing in…" : "Sign In with Password"}
                                </button>

                                <div className="pt-2">
                                    <button
                                        type="button"
                                        onClick={() => { setMode("otp"); setError(null); }}
                                        className="w-full text-center text-xs text-[#6a6a6a] hover:text-[#1a1a1a] py-2 border border-dashed border-[#dcd8d0] rounded-[6px] hover:bg-[#faf9f6] transition-colors"
                                    >
                                        Forgot password? <span className="font-semibold text-[#1a1a1a] underline">Sign in instantly with OTP</span>
                                    </button>
                                </div>
                            </form>
                        ) : (
                            /* --- OTP LOGIN / SIGNUP FORM --- */
                            <div className="space-y-5">
                                <div>
                                    <p className="text-xl font-serif text-[#1a1a1a] mb-1">
                                        {!otpSent ? "One-Time Password Login" : "Enter Verification Code"}
                                    </p>
                                    <p className="text-xs text-[#8a8a8a]">
                                        {!otpSent
                                            ? "We'll send a 6-digit code from WearAura Fragrance directly to your email."
                                            : `A 6-digit code has been sent to ${email}. Check your inbox or spam.`}
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
                                            <label className="block text-xs font-semibold text-[#4a4a4a] uppercase tracking-wider mb-1.5" htmlFor="otp-email">
                                                Your Email Address
                                            </label>
                                            <input
                                                id="otp-email"
                                                type="email"
                                                value={email}
                                                onChange={(e) => { setEmail(e.target.value); setError(null); }}
                                                required
                                                placeholder="you@example.com"
                                                className="w-full border border-[#e8e6e1] rounded-[6px] px-3.5 py-3 text-sm text-[#1a1a1a] placeholder-[#b5b2ac] focus:outline-none focus:ring-1 focus:ring-[#1a1a1a] focus:border-[#1a1a1a] transition"
                                            />
                                        </div>

                                        <div className="p-3 bg-[#faf9f6] rounded-[6px] border border-[#e8e6e1] text-xs text-[#6a6a6a] space-y-1">
                                            <p className="font-medium text-[#1a1a1a] flex items-center gap-1.5">
                                                <Mail className="w-3.5 h-3.5 text-[#8a8a8a]" />
                                                WearAura Fragrance Sender Note:
                                            </p>
                                            <p>Your authentication code will arrive with sender name <strong>WearAura Fragrance</strong>.</p>
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
                                            <label className="block text-xs font-semibold text-[#4a4a4a] uppercase tracking-wider mb-1.5" htmlFor="otp-code">
                                                6-Digit Verification Code
                                            </label>
                                            <input
                                                id="otp-code"
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
                                            {loading ? "Verifying…" : "Verify & Sign In"}
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
                                                {countdown > 0 ? `Resend code in ${countdown}s` : "Resend Code"}
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
                                Don&apos;t have a WearAura account?{" "}
                                <Link href="/signup" className="text-[#1a1a1a] font-semibold hover:underline">
                                    Create one now
                                </Link>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
