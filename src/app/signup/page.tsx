"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";

export default function SignupPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleEmailSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signUp({ email, password });
        setLoading(false);
        if (error) {
            setError(error.message);
        } else {
            setSuccess(true);
            setTimeout(() => { router.push("/"); router.refresh(); }, 1500);
        }
    };

    return (
        <main className="min-h-screen bg-[#FAF9F6] flex items-center justify-center px-4 py-16 font-sans">
            <div className="w-full max-w-[420px]">
                <Link href="/" className="block text-center font-serif text-[28px] text-[#1a1a1a] tracking-wide mb-8">
                    WearAura
                </Link>

                <div className="bg-white border border-[#e8e6e1] rounded-[8px] shadow-sm overflow-hidden">
                    <div className="p-7">
                        {success ? (
                            <div className="flex flex-col items-center py-6 text-center gap-4">
                                <CheckCircle2 className="w-14 h-14 text-green-500" />
                                <div>
                                    <p className="text-lg font-serif text-[#1a1a1a] mb-1">Account created!</p>
                                    <p className="text-sm text-[#8a8a8a]">Welcome to WearAura. Redirecting…</p>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleEmailSignup} className="space-y-5">
                                <div>
                                    <p className="text-xl font-serif text-[#1a1a1a] mb-1">Create account</p>
                                    <p className="text-sm text-[#8a8a8a]">Sign up with your email address</p>
                                </div>

                                {error && <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-[4px] text-sm">{error}</div>}

                                <div>
                                    <label className="block text-xs font-medium text-[#4a4a4a] uppercase tracking-wider mb-2" htmlFor="signup-email">Email</label>
                                    <input
                                        id="signup-email"
                                        type="email"
                                        value={email}
                                        onChange={e => { setEmail(e.target.value); setError(null); }}
                                        required
                                        placeholder="you@example.com"
                                        className="w-full border border-[#e8e6e1] rounded-[4px] px-3 py-3 text-sm text-[#1a1a1a] placeholder-[#c0bdb8] focus:outline-none focus:ring-1 focus:ring-[#1a1a1a] transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-[#4a4a4a] uppercase tracking-wider mb-2" htmlFor="signup-password">Password</label>
                                    <div className="relative">
                                        <input
                                            id="signup-password"
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={e => { setPassword(e.target.value); setError(null); }}
                                            required
                                            minLength={6}
                                            placeholder="Minimum 6 characters"
                                            className="w-full border border-[#e8e6e1] rounded-[4px] px-3 py-3 pr-10 text-sm text-[#1a1a1a] placeholder-[#c0bdb8] focus:outline-none focus:ring-1 focus:ring-[#1a1a1a] transition"
                                        />
                                        <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a8a8a] hover:text-[#1a1a1a]">
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3.5 rounded-[4px] bg-[#1a1a1a] text-white text-sm font-medium hover:bg-[#333] disabled:bg-[#a0a0a0] disabled:cursor-not-allowed transition-colors"
                                >
                                    {loading ? "Creating account…" : "Create Account"}
                                </button>
                            </form>
                        )}
                    </div>

                    {!success && (
                        <div className="px-7 py-4 border-t border-[#e8e6e1] bg-[#faf9f6] text-center">
                            <p className="text-sm text-[#8a8a8a]">
                                Already have an account?{" "}
                                <Link href="/login" className="text-[#1a1a1a] font-medium hover:underline">Sign in</Link>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
