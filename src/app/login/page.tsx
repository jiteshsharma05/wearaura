"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        setLoading(false);
        if (error) { setError(error.message); }
        else {
            setSuccess(true);
            setTimeout(() => { router.push("/"); router.refresh(); }, 1200);
        }
    };

    return (
        <main className="min-h-screen bg-[#FAF9F6] flex items-center justify-center px-4 py-16 font-sans">
            <div className="w-full max-w-[420px]">
                {/* Brand */}
                <Link href="/" className="block text-center font-serif text-[28px] text-[#1a1a1a] tracking-wide mb-8">
                    WearAura
                </Link>

                <div className="bg-white border border-[#e8e6e1] rounded-[8px] shadow-sm overflow-hidden">
                    <div className="p-7">
                        {success ? (
                            <div className="flex flex-col items-center py-6 text-center gap-4">
                                <CheckCircle2 className="w-14 h-14 text-green-500" />
                                <div>
                                    <p className="text-lg font-serif text-[#1a1a1a] mb-1">Welcome back!</p>
                                    <p className="text-sm text-[#8a8a8a]">You're signed in. Redirecting…</p>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleEmailLogin} className="space-y-5">
                                <div>
                                    <p className="text-xl font-serif text-[#1a1a1a] mb-1">Sign in</p>
                                    <p className="text-sm text-[#8a8a8a]">Use your email and password</p>
                                </div>

                                {error && <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-[4px] text-sm">{error}</div>}

                                <div>
                                    <label className="block text-xs font-medium text-[#4a4a4a] uppercase tracking-wider mb-2" htmlFor="login-email">Email</label>
                                    <input
                                        id="login-email"
                                        type="email"
                                        value={email}
                                        onChange={e => { setEmail(e.target.value); setError(null); }}
                                        required
                                        placeholder="you@example.com"
                                        className="w-full border border-[#e8e6e1] rounded-[4px] px-3 py-3 text-sm text-[#1a1a1a] placeholder-[#c0bdb8] focus:outline-none focus:ring-1 focus:ring-[#1a1a1a] transition"
                                    />
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-xs font-medium text-[#4a4a4a] uppercase tracking-wider" htmlFor="login-password">Password</label>
                                        <Link href="/forgot-password" className="text-xs text-[#8a8a8a] hover:text-[#1a1a1a] transition-colors">Forgot password?</Link>
                                    </div>
                                    <div className="relative">
                                        <input
                                            id="login-password"
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={e => { setPassword(e.target.value); setError(null); }}
                                            required
                                            placeholder="••••••••"
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
                                    {loading ? "Signing in…" : "Sign In"}
                                </button>
                            </form>
                        )}
                    </div>

                    {!success && (
                        <div className="px-7 py-4 border-t border-[#e8e6e1] bg-[#faf9f6] text-center">
                            <p className="text-sm text-[#8a8a8a]">
                                Don't have an account?{" "}
                                <Link href="/signup" className="text-[#1a1a1a] font-medium hover:underline">Create one</Link>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
