export interface OrderItemPayload {
    product_id?: string;
    name: string;
    quantity: number;
    price: number;
    image_url?: string;
}

export interface OrderEmailPayload {
    orderId: string;
    customerEmail: string;
    customerName: string;
    phoneNumber?: string;
    address: {
        addressLine1: string;
        addressLine2?: string;
        city: string;
        state: string;
        pincode: string;
        country?: string;
    };
    items: OrderItemPayload[];
    totalAmount: number;
    paymentMethod: "online" | "cod";
    paymentId?: string;
}

export function generateOrderConfirmationHtml(data: OrderEmailPayload): string {
    const isOnline = data.paymentMethod === "online";
    const paymentLabel = isOnline ? "Paid Online (Razorpay)" : "Cash on Delivery (COD)";
    const paymentBadgeColor = isOnline ? "#059669" : "#b45309";
    const paymentBadgeBg = isOnline ? "#ecfdf5" : "#fffbeb";

    const itemsHtml = data.items
        .map(
            (item) => `
            <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #f0ede6; vertical-align: top;">
                    <div style="font-weight: 600; font-size: 14px; color: #1a1a1a;">${item.name}</div>
                    <div style="font-size: 12px; color: #8a8a8a; margin-top: 2px;">Qty: ${item.quantity} &times; &#8377;${item.price.toLocaleString("en-IN")}</div>
                </td>
                <td style="padding: 12px 0; border-bottom: 1px solid #f0ede6; text-align: right; vertical-align: top; font-weight: 600; font-size: 14px; color: #1a1a1a;">
                    &#8377;${(item.quantity * item.price).toLocaleString("en-IN")}
                </td>
            </tr>
        `
        )
        .join("");

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WearAura Order Confirmation - ${data.orderId}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF9F6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1a1a1a; -webkit-font-smoothing: antialiased;">
    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF9F6; padding: 40px 16px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" max-width="580" style="max-width: 580px; background-color: #ffffff; border: 1px solid #e8e6e1; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.03);">
                    
                    <!-- Header -->
                    <tr>
                        <td align="center" style="padding: 36px 32px 28px 32px; background-color: #1a1a1a;">
                            <h1 style="margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 28px; font-weight: normal; color: #FAF9F6; letter-spacing: 2px;">WearAura</h1>
                            <p style="margin: 6px 0 0 0; font-size: 10px; text-transform: uppercase; letter-spacing: 3px; color: #c4a8d4;">Luxury Fragrances</p>
                        </td>
                    </tr>

                    <!-- Status Banner -->
                    <tr>
                        <td style="padding: 32px 32px 20px 32px; text-align: center;">
                            <div style="display: inline-block; background-color: ${paymentBadgeBg}; color: ${paymentBadgeColor}; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">
                                ${paymentLabel}
                            </div>
                            <h2 style="margin: 0 0 8px 0; font-family: 'Playfair Display', Georgia, serif; font-size: 22px; color: #1a1a1a;">Thank You for Your Order</h2>
                            <p style="margin: 0; font-size: 14px; color: #6a6a6a; line-height: 1.5;">
                                Dear ${data.customerName || "Customer"}, your fragrance order has been confirmed and is being prepared with utmost care.
                            </p>
                        </td>
                    </tr>

                    <!-- Order Details Summary Box -->
                    <tr>
                        <td style="padding: 0 32px 24px 32px;">
                            <div style="background-color: #faf9f6; border: 1px solid #e8e6e1; border-radius: 8px; padding: 16px 20px;">
                                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                    <tr>
                                        <td style="font-size: 12px; color: #8a8a8a; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 4px;">Order Reference</td>
                                        <td style="font-size: 12px; color: #8a8a8a; text-transform: uppercase; letter-spacing: 1px; text-align: right; padding-bottom: 4px;">Payment Method</td>
                                    </tr>
                                    <tr>
                                        <td style="font-family: monospace; font-size: 14px; font-weight: 600; color: #1a1a1a;">${data.orderId}</td>
                                        <td style="font-size: 13px; font-weight: 600; color: #1a1a1a; text-align: right;">${isOnline ? "Online" : "Cash on Delivery"}</td>
                                    </tr>
                                    ${data.paymentId ? `
                                    <tr>
                                        <td colspan="2" style="padding-top: 8px; font-size: 11px; color: #8a8a8a;">
                                            Payment Ref: <span style="font-family: monospace; color: #1a1a1a;">${data.paymentId}</span>
                                        </td>
                                    </tr>
                                    ` : ""}
                                </table>
                            </div>
                        </td>
                    </tr>

                    <!-- Order Items -->
                    <tr>
                        <td style="padding: 0 32px 24px 32px;">
                            <h3 style="margin: 0 0 12px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; color: #8a8a8a;">Ordered Items</h3>
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                ${itemsHtml}
                                <tr>
                                    <td style="padding: 16px 0 8px 0; font-size: 14px; font-weight: 600; color: #1a1a1a;">Total Amount</td>
                                    <td style="padding: 16px 0 8px 0; text-align: right; font-size: 18px; font-weight: 700; color: #1a1a1a;">
                                        &#8377;${data.totalAmount.toLocaleString("en-IN")}
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Shipping Address -->
                    <tr>
                        <td style="padding: 0 32px 28px 32px;">
                            <div style="border-top: 1px solid #e8e6e1; padding-top: 20px;">
                                <h3 style="margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; color: #8a8a8a;">Delivery Address</h3>
                                <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #4a4a4a;">
                                    <strong>${data.customerName}</strong><br>
                                    ${data.address.addressLine1}${data.address.addressLine2 ? `, ${data.address.addressLine2}` : ""}<br>
                                    ${data.address.city}, ${data.address.state} - ${data.address.pincode}<br>
                                    ${data.phoneNumber ? `Phone: ${data.phoneNumber}` : ""}
                                </p>
                            </div>
                        </td>
                    </tr>

                    <!-- Next steps -->
                    <tr>
                        <td style="padding: 0 32px 32px 32px;">
                            <div style="background-color: #faf9f6; border-radius: 8px; padding: 16px; font-size: 12px; color: #6a6a6a; line-height: 1.5;">
                                ${isOnline 
                                    ? "Your package will be dispatched within 24-48 hours. You will receive a tracking update once it ships."
                                    : "Please keep the exact amount of <strong>&#8377;" + data.totalAmount.toLocaleString("en-IN") + "</strong> ready for collection upon courier delivery."}
                            </div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 24px 32px; background-color: #faf9f6; border-top: 1px solid #e8e6e1; text-align: center;">
                            <p style="margin: 0 0 6px 0; font-size: 12px; color: #4a4a4a;">
                                Need assistance? Reach us at <a href="mailto:support@wearaura.com" style="color: #1a1a1a; font-weight: 600; text-decoration: none;">support@wearaura.com</a>
                            </p>
                            <p style="margin: 0; font-size: 11px; color: #8a8a8a;">
                                &copy; WearAura Luxury Fragrance &bull; All rights reserved.
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
}
