import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { CartProvider } from "@/components/CartProvider";
import { AuthProvider } from "@/components/AuthProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: '--font-cormorant'
});

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: "WearAura",
  description: "Premium Direct-to-Consumer e-commerce website for WearAura Fragrance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="font-sans antialiased text-[#1a1a1a] bg-[#FAF9F6]">
        <AuthProvider>
          <CartProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
            <Toaster position="bottom-right" toastOptions={{ duration: 3000 }} />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
