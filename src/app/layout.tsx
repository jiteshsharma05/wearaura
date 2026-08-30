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
      <body className="font-sans antialiased text-[#F2EFE9] bg-[#0B0B0D]">
        <AuthProvider>
          <CartProvider>
            <div className="flex min-h-screen flex-col bg-[#0B0B0D] text-[#F2EFE9]">
              <Header />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
            <Toaster 
              position="bottom-right" 
              toastOptions={{ 
                duration: 3000,
                style: {
                  background: '#16151A',
                  color: '#F2EFE9',
                  border: '1px solid rgba(201, 164, 97, 0.25)',
                  boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.7)',
                  fontSize: '13px',
                  fontFamily: 'var(--font-inter)',
                },
                success: {
                  iconTheme: {
                    primary: '#C9A461',
                    secondary: '#0B0B0D',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#E05252',
                    secondary: '#0B0B0D',
                  },
                },
              }} 
            />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
