"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ResetPasswordPage() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Check if we have a session (Supabase handles the recovery token by setting a session)
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                // If no session, they might have clicked an expired link or directly navigated here
                toast.error("Session expired or invalid link.");
                router.push("/login");
            }
        };
        checkSession();
    }, [router]);

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        setLoading(true);
        const { error } = await supabase.auth.updateUser({
            password: password
        });

        if (error) {
            toast.error(error.message);
        } else {
            toast.success("Password updated successfully! Redirecting to login...");
            await supabase.auth.signOut();
            setTimeout(() => {
                router.push("/login");
            }, 2000);
        }
        setLoading(false);
    };

    return (
        <main className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[70vh]">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900">
                <h1 className="text-2xl font-light text-zinc-900 dark:text-zinc-100 tracking-tight mb-2">Set New Password</h1>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-8">
                    Please enter your new password below.
                </p>

                <form onSubmit={handleUpdatePassword} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1" htmlFor="password">
                            New Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-black focus:outline-none transition-shadow"
                            placeholder="••••••••"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1" htmlFor="confirmPassword">
                            Confirm New Password
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-black focus:outline-none transition-shadow"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 rounded-xl font-medium text-white mt-4 ${loading ? "bg-zinc-400 cursor-not-allowed" : "bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
                            } transition-all active:scale-[0.98]`}
                    >
                        {loading ? "Updating..." : "Update Password"}
                    </button>
                </form>
            </div>
        </main>
    );
}
