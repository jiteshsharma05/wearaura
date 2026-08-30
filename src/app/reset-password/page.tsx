"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

export default function ResetPasswordPage() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Verify session from recovery link
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                // If no active recovery session, show notice
                // Supabase also parses token from URL hash if redirected
            }
        };
        checkSession();
    }, []);

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password: password,
            });

            if (updateError) {
                setError(updateError.message);
                toast.error(updateError.message);
            } else {
                setSuccess(true);
                toast.success("Password updated successfully!");
                await supabase.auth.signOut();
                setTimeout(() => {
                    router.push("/login");
                }, 2000);
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to update password");
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
                        {success ? (
                            <div className="flex flex-col items-center py-6 text-center gap-4 animate-in fade-in">
                                <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-1">
                                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-serif text-[#1a1a1a] mb-1">Password Updated</h1>
                                    <p className="text-xs text-[#8a8a8a]">Your password has been reset. Redirecting to sign in…</p>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleUpdatePassword} className="space-y-4">
                                <div>
                                    <h1 className="text-xl font-serif text-[#1a1a1a] mb-1">Set New Password</h1>
                                    <p className="text-xs text-[#8a8a8a]">
                                        Enter and confirm your new password for WearAura
                                    </p>
                                </div>

                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-[6px] text-xs font-medium">
                                        {error}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-xs font-semibold text-[#4a4a4a] uppercase tracking-wider mb-1.5" htmlFor="new-password">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="new-password"
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
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-[#4a4a4a] uppercase tracking-wider mb-1.5" htmlFor="confirm-password">
                                        Confirm New Password
                                    </label>
                                    <input
                                        id="confirm-password"
                                        type={showPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => { setConfirmPassword(e.target.value); setError(null); }}
                                        required
                                        minLength={6}
                                        placeholder="Re-enter new password"
                                        className="w-full border border-[#e8e6e1] rounded-[6px] px-3.5 py-2.5 text-sm text-[#1a1a1a] placeholder-[#b5b2ac] focus:outline-none focus:ring-1 focus:ring-[#1a1a1a] focus:border-[#1a1a1a] transition"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3.5 rounded-[6px] bg-[#1a1a1a] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#333] disabled:bg-[#a0a0a0] disabled:cursor-not-allowed transition-all shadow-sm active:scale-[0.99] mt-2"
                                >
                                    {loading ? "Updating Password…" : "Update Password"}
                                </button>
                            </form>
                        )}
                    </div>

                    <div className="px-7 py-4 border-t border-[#e8e6e1] bg-[#faf9f6] text-center">
                        <Link href="/login" className="text-xs text-[#8a8a8a] hover:text-[#1a1a1a]">
                            Remember your password? <span className="font-semibold text-[#1a1a1a] underline">Sign in</span>
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
