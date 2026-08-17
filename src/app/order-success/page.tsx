import Link from "next/link";

export default async function OrderSuccessPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const sp = await searchParams;
    const orderId = sp?.orderId as string;
    const method = sp?.method as string; // 'online' or 'cod'
    const paymentId = sp?.paymentId as string;

    const isOnline = method === "online";
    const isCOD = method === "cod";

    return (
        <main className="container mx-auto px-4 py-24 flex justify-center items-center min-h-[70vh]">
            <div className="w-full max-w-lg bg-white p-10 rounded-3xl shadow-sm border text-center">
                <div className={`w-20 h-20 ${isOnline ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'} rounded-full flex items-center justify-center mx-auto mb-6`}>
                    {isOnline ? (
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    ) : (
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {isOnline ? 'Payment Successful!' : 'Order Placed!'}
                </h1>

                {orderId && (
                    <div className="mb-4">
                        <span className="text-sm text-gray-500 font-medium">Order ID: </span>
                        <span className="text-sm font-semibold tracking-wide text-gray-900 bg-gray-100 px-3 py-1 rounded-full">{orderId}</span>
                    </div>
                )}

                {/* Payment method badge */}
                <div className="mb-6">
                    {isOnline ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-green-50 text-green-700 border border-green-200">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Paid Online
                        </span>
                    ) : isCOD ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" strokeWidth={2}/><path strokeLinecap="round" strokeWidth={2} d="M12 8v4M9 12h6" /></svg>
                            Cash on Delivery
                        </span>
                    ) : null}
                </div>

                {paymentId && (
                    <div className="mb-6">
                        <span className="text-xs text-gray-400 font-medium">Payment ID: </span>
                        <span className="text-xs font-mono text-gray-600 bg-gray-50 px-2 py-0.5 rounded">{paymentId}</span>
                    </div>
                )}

                <p className="text-gray-500 mb-8 text-lg">
                    {isOnline
                        ? 'Thank you for your purchase. Your payment has been verified and your order is being processed.'
                        : 'Thank you for your order. Please keep the exact amount ready for delivery.'
                    }
                </p>

                <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
                    <p className="text-sm text-gray-500 mb-1">What&apos;s next?</p>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-2">
                        <li>You will receive an email confirmation.</li>
                        <li>We will notify you when your order ships.</li>
                        <li>Your order tracking link will be provided.</li>
                        {isCOD && <li>Payment will be collected at the time of delivery.</li>}
                    </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                        href="/my-orders"
                        className="flex-1 inline-block bg-gray-100 text-gray-900 py-4 rounded-xl font-semibold text-lg hover:bg-gray-200 transition-colors text-center"
                    >
                        View Orders
                    </Link>
                    <Link
                        href="/"
                        className="flex-1 inline-block bg-black text-white py-4 rounded-xl font-semibold text-lg hover:bg-gray-800 transition-colors focus:ring-4 focus:ring-gray-200 text-center"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </main>
    );
}
