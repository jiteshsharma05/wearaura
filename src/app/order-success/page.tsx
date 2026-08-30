"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Package, Mail, Sparkles } from "lucide-react";

function OrderSuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId") || "";
    const method = searchParams.get("method") || ""; // 'online' or 'cod'
    const paymentId = searchParams.get("paymentId") || "";

    const isOnline = method === "online";
    const isCOD = method === "cod";

    return (
        <div className="w-full max-w-lg bg-white p-8 sm:p-10 rounded-[12px] shadow-sm border border-[#e8e6e1] text-center">
            {/* Brand Title */}
            <div className="mb-6">
                <p className="font-serif text-2xl tracking-wider text-[#1a1a1a]">WearAura</p>
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#8a8a8a] mt-0.5">Luxury Fragrances</p>
            </div>

            <div className={`w-16 h-16 ${isOnline ? 'bg-emerald-50 text-emerald-600' : 'bg-[#f4f2ed] text-[#1a1a1a]'} rounded-full flex items-center justify-center mx-auto mb-5 border border-[#e8e6e1]`}>
                <CheckCircle2 className="w-8 h-8" />
            </div>

            <h1 className="text-2xl font-serif text-[#1a1a1a] mb-2">
                {isOnline ? 'Order & Payment Confirmed!' : 'Order Placed Successfully!'}
            </h1>

            {orderId && (
                <div className="mb-4 inline-flex items-center gap-2 bg-[#FAF9F6] border border-[#e8e6e1] px-3.5 py-1.5 rounded-full text-xs">
                    <span className="text-[#8a8a8a] font-medium">Order ID:</span>
                    <span className="font-mono font-semibold text-[#1a1a1a]">{orderId}</span>
                </div>
            )}

            {/* Payment method badge */}
            <div className="mb-6 flex justify-center">
                {isOnline ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <Sparkles className="w-3.5 h-3.5" />
                        Paid Online & Verified
                    </span>
                ) : isCOD ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                        <Package className="w-3.5 h-3.5" />
                        Cash on Delivery
                    </span>
                ) : null}
            </div>

            {paymentId && (
                <div className="mb-6 text-xs text-[#8a8a8a]">
                    Payment Reference: <span className="font-mono text-[#1a1a1a]">{paymentId}</span>
                </div>
            )}

            <p className="text-[#6a6a6a] mb-6 text-sm leading-relaxed">
                {isOnline
                    ? 'Thank you for choosing WearAura Fragrances. Your payment is verified and your handcrafted fragrance parcel is being prepared.'
                    : 'Thank you for choosing WearAura Fragrances. Your order is registered. Please keep the exact amount ready for courier delivery.'}
            </p>

            {/* Notification guidance box */}
            <div className="bg-[#FAF9F6] border border-[#e8e6e1] rounded-[8px] p-5 mb-8 text-left space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1a1a1a]">
                    <Mail className="w-4 h-4 text-[#8a8a8a]" />
                    WearAura Notification & Updates
                </div>
                <ul className="text-xs text-[#555555] space-y-2 list-disc list-inside">
                    <li>
                        An order confirmation has been logged under your <strong>WearAura Fragrance</strong> account.
                    </li>
                    <li>
                        Our team carefully inspects and packages every perfume bottle to ensure premium arrival.
                    </li>
                    <li>
                        Real-time tracking updates will be available under <strong>My Orders</strong>.
                    </li>
                    {isCOD && (
                        <li className="font-medium text-[#1a1a1a]">
                            Cash/UPI payment will be collected by the delivery agent at your doorstep.
                        </li>
                    )}
                </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <Link
                    href="/my-orders"
                    className="flex-1 py-3 px-4 rounded-[6px] border border-[#1a1a1a] text-[#1a1a1a] text-xs font-semibold uppercase tracking-wider hover:bg-[#1a1a1a] hover:text-white transition-all text-center"
                >
                    View My Orders
                </Link>
                <Link
                    href="/"
                    className="flex-1 py-3 px-4 rounded-[6px] bg-[#1a1a1a] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#333] transition-all text-center shadow-xs"
                >
                    Continue Exploring
                </Link>
            </div>
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <main className="min-h-screen bg-[#FAF9F6] flex justify-center items-center px-4 py-16 font-sans text-[#1a1a1a]">
            <Suspense fallback={
                <div className="w-full max-w-lg bg-white p-12 rounded-[12px] shadow-sm border border-[#e8e6e1] text-center">
                    <div className="animate-spin w-8 h-8 border-2 border-[#1a1a1a] border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-xs uppercase tracking-widest text-[#8a8a8a]">Loading confirmation...</p>
                </div>
            }>
                <OrderSuccessContent />
            </Suspense>
        </main>
    );
}
