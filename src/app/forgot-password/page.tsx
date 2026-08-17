"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleResetRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) {
            toast.error(error.message);
        } else {
            toast.success("Password reset link sent to your email!");
            setEmail("");
        }
        setLoading(false);
    };

    return (
        <main className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[70vh]">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="mb-6">
                    <Link href="/login" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-black transition-colors">
                        <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to login
                    </Link>
                </div>

                <h1 className="text-2xl font-light text-zinc-900 dark:text-zinc-100 tracking-tight mb-2">Forgot Password</h1>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-8">
                    Enter your email address and we'll send you a link to reset your password.
                </p>

                <form onSubmit={handleResetRequest} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1" htmlFor="email">
                            Email address
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-black focus:outline-none transition-shadow"
                            placeholder="you@example.com"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 rounded-xl font-medium text-white mt-4 ${loading ? "bg-zinc-400 cursor-not-allowed" : "bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
                            } transition-all active:scale-[0.98]`}
                    >
                        {loading ? "Sending link..." : "Send Reset Link"}
                    </button>
                </form>
            </div>
        </main>
    );
}
