"use client";

import { useCart } from "@/components/CartProvider";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";
import { useState } from "react";
import toast from "react-hot-toast";
import Script from "next/script";

// Extend window to include Razorpay
declare global {
    interface Window {
        Razorpay: new (...args: unknown[]) => { open(): void; on(event: string, cb: (r: { error?: { description?: string } }) => void): void };
    }
}

type PaymentMethod = "online" | "cod";

export default function CartPage() {
    const { items, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const router = useRouter();
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);

    // Payment Method
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("online");

    // Delivery Fields
    const [fullName, setFullName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [addressLine1, setAddressLine1] = useState("");
    const [addressLine2, setAddressLine2] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [pincode, setPincode] = useState("");

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

    // --- Validate delivery fields ---
    const validateDeliveryFields = (): boolean => {
        if (!fullName.trim() || !phoneNumber.trim() || !addressLine1.trim() || !city.trim() || !state.trim() || !pincode.trim()) {
            toast.error("Please fill all required delivery fields.");
            return false;
        }

        if (!/^\d{10}$/.test(phoneNumber)) {
            toast.error("Please enter a valid 10-digit phone number.");
            return false;
        }

        if (!/^\d{6}$/.test(pincode)) {
            toast.error("Please enter a valid 6-digit pincode.");
            return false;
        }

        return true;
    };

    // --- COD Checkout ---
    const handleCODCheckout = async () => {
        if (!user) {
            router.push("/login");
            return;
        }

        if (!validateDeliveryFields()) return;

        try {
            setIsCheckingOut(true);

            // TODO: RE-ENABLE serviceable_locations check before going live!
            // The serviceable_locations table needs to be populated with valid pincodes.
            // Uncomment the block below and remove the bypass when ready for production.
            //
            // const { data: locationData, error: locationError } = await supabase
            //     .from("serviceable_locations")
            //     .select("pincode")
            //     .eq("pincode", pincode)
            //     .single();
            //
            // if (locationError || !locationData) {
            //     toast.error("Sorry, we currently do not deliver to this location.");
            //     setIsCheckingOut(false);
            //     return;
            // }

            // 1. Pre-check stock
            const { data: currentProducts, error: stockCheckError } = await supabase
                .from("products")
                .select("id, name, stock")
                .in("id", items.map(i => i.id));

            if (stockCheckError) throw stockCheckError;

            for (const item of items) {
                const dbProduct = currentProducts?.find(p => p.id === item.id);
                if (!dbProduct || dbProduct.stock < item.quantity) {
                    throw new Error(`Insufficient stock for ${item.name}. Available: ${dbProduct?.stock || 0}`);
                }
            }

            // 2. Insert order with status cod_pending
            const { data: orderData, error: orderError } = await supabase
                .from("orders")
                .insert([{
                    user_id: user.id,
                    total_amount: cartTotal,
                    status: "cod_pending",
                    payment_method: "cod",
                    full_name: fullName.trim(),
                    phone_number: phoneNumber.trim(),
                    address_line1: addressLine1.trim(),
                    address_line2: addressLine2.trim(),
                    city: city.trim(),
                    state: state.trim(),
                    pincode: pincode.trim(),
                    country: 'India',
                    items_snapshot: items.map(item => ({
                        product_id: item.id,
                        name: item.name,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                }])
                .select()
                .single();

            if (orderError) throw orderError;

            // 3. Insert into order_items
            const orderItemsInsert = items.map((item) => ({
                order_id: orderData.id,
                product_id: item.id,
                quantity: item.quantity,
                price: item.price,
            }));

            const { error: itemsError } = await supabase
                .from("order_items")
                .insert(orderItemsInsert);

            if (itemsError) throw itemsError;

            // 4. Clear cart and redirect
            clearCart();
            router.push(`/order-success?orderId=${orderData.id}&method=cod`);

        } catch (error: unknown) {
            console.error("COD Checkout Failed:", error);
            toast.error(error instanceof Error ? error.message : "Checkout failed. Please try again.");
            setIsCheckingOut(false);
        }
    };

    // --- Online Payment Checkout (Razorpay) ---
    const handleOnlineCheckout = async () => {
        if (!user) {
            router.push("/login");
            return;
        }

        if (!validateDeliveryFields()) return;

        if (!razorpayLoaded || !window.Razorpay) {
            toast.error("Payment system is loading. Please wait a moment and try again.");
            return;
        }

        try {
            setIsCheckingOut(true);

            // Get the user's session token for Edge Function auth
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                toast.error("Session expired. Please log in again.");
                router.push("/login");
                return;
            }

            // 1. Call create-razorpay-order Edge Function
            const createOrderResponse = await fetch(
                `${supabaseUrl}/functions/v1/create-razorpay-order`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${session.access_token}`,
                    },
                    body: JSON.stringify({
                        items: items.map(item => ({
                            product_id: item.id,
                            quantity: item.quantity,
                        })),
                        delivery_address: {
                            full_name: fullName.trim(),
                            phone_number: phoneNumber.trim(),
                            address_line1: addressLine1.trim(),
                            address_line2: addressLine2.trim(),
                            city: city.trim(),
                            state: state.trim(),
                            pincode: pincode.trim(),
                        },
                    }),
                }
            );

            const createOrderData = await createOrderResponse.json();

            if (!createOrderResponse.ok) {
                throw new Error(createOrderData.error || "Failed to create order");
            }

            // 2. Open Razorpay Checkout popup
            const options = {
                key: createOrderData.key_id,
                amount: createOrderData.amount,
                currency: createOrderData.currency || "INR",
                name: "WearAura",
                description: "Fragrance Purchase",
                order_id: createOrderData.razorpay_order_id,
                prefill: {
                    name: fullName.trim(),
                    contact: phoneNumber.trim(),
                    email: user.email || "",
                },
                theme: {
                    color: "#1a1a1a",
                },
                handler: async (response: {
                    razorpay_order_id: string;
                    razorpay_payment_id: string;
                    razorpay_signature: string;
                }) => {
                    // 3. Verify payment via Edge Function
                    try {
                        const verifyResponse = await fetch(
                            `${supabaseUrl}/functions/v1/verify-razorpay-payment`,
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    "Authorization": `Bearer ${session.access_token}`,
                                },
                                body: JSON.stringify({
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_signature: response.razorpay_signature,
                                }),
                            }
                        );

                        const verifyData = await verifyResponse.json();

                        if (!verifyResponse.ok) {
                            throw new Error(verifyData.error || "Payment verification failed");
                        }

                        // Payment verified successfully
                        clearCart();
                        router.push(
                            `/order-success?orderId=${createOrderData.order_id}&method=online&paymentId=${response.razorpay_payment_id}`
                        );
                    } catch (verifyError: unknown) {
                        console.error("Payment verification failed:", verifyError);
                        toast.error(verifyError instanceof Error ? verifyError.message : "Payment verification failed. Contact support if amount was debited.");
                        setIsCheckingOut(false);
                    }
                },
                modal: {
                    ondismiss: () => {
                        toast.error("Payment was cancelled.");
                        setIsCheckingOut(false);
                    },
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.on("payment.failed", (response: { error?: { description?: string } }) => {
                console.error("Payment failed:", response.error);
                toast.error(response.error?.description || "Payment failed. Please try again.");
                setIsCheckingOut(false);
            });
            razorpay.open();

        } catch (error: unknown) {
            console.error("Online Checkout Failed:", error);
            toast.error(error instanceof Error ? error.message : "Checkout failed. Please try again.");
            setIsCheckingOut(false);
        }
    };

    // --- Main checkout handler ---
    const handleCheckout = async () => {
        if (paymentMethod === "cod") {
            await handleCODCheckout();
        } else {
            await handleOnlineCheckout();
        }
    };

    if (items.length === 0) {
        return (
            <main className="container mx-auto px-4 py-16 max-w-4xl text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Cart is Empty</h1>
                <p className="text-gray-500 mb-8">Looks like you haven&apos;t added any products to your cart yet.</p>
                <Link
                    href="/"
                    className="inline-block bg-black text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
                >
                    Continue Shopping
                </Link>
            </main>
        );
    }

    return (
        <>
            {/* Load Razorpay Checkout.js */}
            <Script
                src="https://checkout.razorpay.com/v1/checkout.js"
                onLoad={() => setRazorpayLoaded(true)}
                onError={() => console.error('Failed to load Razorpay Checkout.js')}
                strategy="afterInteractive"
            />

            <main className="container mx-auto px-4 py-12 max-w-6xl">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    <div className="flex-grow">
                        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                            <ul className="divide-y divide-gray-200">
                                {items.map((item) => (
                                    <li key={item.id} className="p-6 flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                                        {/* Item Image */}
                                        <div className="w-24 h-24 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 mb-4 sm:mb-0">
                                            {(item.images && item.images.length > 0) || item.image_url ? (
                                                <img
                                                    src={(item.images && item.images.length > 0) ? item.images[0] : (item.image_url || "")}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                                                    No image
                                                </div>
                                            )}
                                        </div>

                                        {/* Item Details */}
                                        <div className="flex-1 flex flex-col w-full sm:w-auto text-center sm:text-left">
                                            <div className="flex justify-between flex-col sm:flex-row mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    <Link href={`/products/${item.id}`} className="hover:text-blue-600 transition-colors">
                                                        {item.name}
                                                    </Link>
                                                </h3>
                                                <p className="font-semibold text-gray-900 mt-2 sm:mt-0 sm:ml-4">
                                                    ₹{(item.price * item.quantity).toFixed(2)}
                                                </p>
                                            </div>

                                            <p className="text-gray-500 text-sm mb-4">₹{item.price.toFixed(2)} each</p>

                                            <div className="flex items-center justify-center sm:justify-start gap-4 mt-auto">
                                                {/* Quantity Controls */}
                                                <div className="flex items-center border rounded-lg overflow-hidden bg-gray-50">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="px-3 py-1 hover:bg-gray-200 transition-colors text-gray-600"
                                                        aria-label="Decrease quantity"
                                                    >
                                                        &minus;
                                                    </button>
                                                    <span className="px-4 font-medium min-w-[3rem] text-center bg-white border-x">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="px-3 py-1 hover:bg-gray-200 transition-colors text-gray-600"
                                                        aria-label="Increase quantity"
                                                    >
                                                        &#43;
                                                    </button>
                                                </div>

                                                {/* Remove Button */}
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-sm text-red-600 hover:text-red-800 font-medium transition-colors ml-auto"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="w-full lg:w-[400px] flex-shrink-0">
                        <div className="bg-gray-50 rounded-2xl p-6 border sticky top-24">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Delivery Details</h2>

                            {/* Delivery Details Form */}
                            <div className="space-y-4 mb-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Full Name *</label>
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={e => setFullName(e.target.value)}
                                            className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-1 focus:ring-black outline-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Phone Number *</label>
                                        <input
                                            type="tel"
                                            value={phoneNumber}
                                            onChange={e => setPhoneNumber(e.target.value)}
                                            placeholder="10 digits"
                                            className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-1 focus:ring-black outline-none"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Address Line 1 *</label>
                                    <input
                                        type="text"
                                        value={addressLine1}
                                        onChange={e => setAddressLine1(e.target.value)}
                                        placeholder="House/Flat No, Building, Street"
                                        className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-1 focus:ring-black outline-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Address Line 2 (Optional)</label>
                                    <input
                                        type="text"
                                        value={addressLine2}
                                        onChange={e => setAddressLine2(e.target.value)}
                                        placeholder="Locality, Landmark"
                                        className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-1 focus:ring-black outline-none"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">City *</label>
                                        <input
                                            type="text"
                                            value={city}
                                            onChange={e => setCity(e.target.value)}
                                            className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-1 focus:ring-black outline-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">State *</label>
                                        <input
                                            type="text"
                                            value={state}
                                            onChange={e => setState(e.target.value)}
                                            className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-1 focus:ring-black outline-none"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Pincode *</label>
                                        <input
                                            type="text"
                                            value={pincode}
                                            onChange={e => setPincode(e.target.value)}
                                            placeholder="6 digits"
                                            maxLength={6}
                                            className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-1 focus:ring-black outline-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Country</label>
                                        <input
                                            type="text"
                                            value="India"
                                            disabled
                                            className="w-full px-3 py-2 border border-gray-100 bg-gray-100 text-gray-500 rounded-xl text-sm font-medium cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method Selection */}
                            <div className="border-t pt-6 mb-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h2>
                                <div className="space-y-3">
                                    <label
                                        className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                            paymentMethod === "online"
                                                ? "border-[#1a1a1a] bg-gray-50"
                                                : "border-gray-200 hover:border-gray-300"
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="online"
                                            checked={paymentMethod === "online"}
                                            onChange={() => setPaymentMethod("online")}
                                            className="w-4 h-4 text-black accent-black"
                                        />
                                        <div className="flex-1">
                                            <span className="font-semibold text-sm text-gray-900">Pay Online</span>
                                            <p className="text-xs text-gray-500 mt-0.5">UPI · Cards · Netbanking · Wallets</p>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-gray-400">
                                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>
                                        </div>
                                    </label>

                                    <label
                                        className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                            paymentMethod === "cod"
                                                ? "border-[#1a1a1a] bg-gray-50"
                                                : "border-gray-200 hover:border-gray-300"
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="cod"
                                            checked={paymentMethod === "cod"}
                                            onChange={() => setPaymentMethod("cod")}
                                            className="w-4 h-4 text-black accent-black"
                                        />
                                        <div className="flex-1">
                                            <span className="font-semibold text-sm text-gray-900">Cash on Delivery</span>
                                            <p className="text-xs text-gray-500 mt-0.5">Pay when you receive your order</p>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-gray-400">
                                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="8"/><path d="M12 8v4M9 12h6"/></svg>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="border-t pt-6 space-y-4 mb-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                                    <span>₹{cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span>Calculated at checkout</span>
                                </div>
                                <div className="border-t pt-4 flex justify-between font-bold text-lg text-gray-900">
                                    <span>Total</span>
                                    <span>₹{cartTotal.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={isCheckingOut}
                                className={`w-full py-4 rounded-xl font-semibold text-lg transition-colors focus:ring-4 focus:ring-gray-200 ${isCheckingOut
                                    ? 'bg-gray-400 text-white cursor-not-allowed'
                                    : 'bg-[#1a1a1a] text-white hover:bg-[#333] active:bg-[#000]'
                                    }`}
                            >
                                {isCheckingOut
                                    ? 'Processing...'
                                    : paymentMethod === "cod"
                                        ? 'Place Order (COD)'
                                        : 'Pay Now'
                                }
                            </button>

                            {paymentMethod === "online" && (
                                <p className="text-xs text-gray-400 text-center mt-3">
                                    Secured by Razorpay · 256-bit SSL encrypted
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
