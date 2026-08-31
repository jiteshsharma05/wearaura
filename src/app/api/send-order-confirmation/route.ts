import { NextResponse } from "next/server";
import { generateOrderConfirmationHtml, OrderEmailPayload } from "../../../../lib/orderEmail";

export async function POST(request: Request) {
    try {
        const body: OrderEmailPayload = await request.json();

        if (!body.orderId || !body.customerEmail || !body.items || body.items.length === 0) {
            return NextResponse.json(
                { error: "Missing required order confirmation fields" },
                { status: 400 }
            );
        }

        const html = generateOrderConfirmationHtml(body);
        const resendApiKey = process.env.RESEND_API_KEY;

        if (resendApiKey) {
            // Send via Resend if API key is configured
            const resendResponse = await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${resendApiKey}`,
                },
                body: JSON.stringify({
                    from: "WearAura Fragrance <orders@wearaura.com>",
                    to: [body.customerEmail],
                    subject: `Order Confirmation #${body.orderId.slice(0, 8)} - WearAura Fragrances`,
                    html: html,
                }),
            });

            const resendData = await resendResponse.json();
            if (!resendResponse.ok) {
                console.error("Resend delivery failed:", resendData);
                return NextResponse.json(
                    { success: false, warning: "Email delivery provider error", details: resendData },
                    { status: 200 }
                );
            }

            return NextResponse.json({ success: true, emailId: resendData.id });
        } else {
            // Fallback / log for dev & test environments
            console.log(`[WearAura Email] Order confirmation generated for order ${body.orderId} to ${body.customerEmail}`);
            return NextResponse.json({
                success: true,
                simulated: true,
                message: "Order confirmation email generated. (Add RESEND_API_KEY to .env.local to enable live SMTP delivery)",
            });
        }
    } catch (error: unknown) {
        console.error("Error generating/sending order confirmation email:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Internal Server Error" },
            { status: 500 }
        );
    }
}
