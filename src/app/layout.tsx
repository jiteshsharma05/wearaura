import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, EB_Garamond, Geist } from "next/font/google";
import { CartProvider } from "@/components/CartProvider";
import { AuthProvider } from "@/components/AuthProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-eb-garamond",
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "WearAura — Haute Parfumerie",
  description: "Handcrafted haute parfumerie capturing rare botanical distillations for a magnetic sillage.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${ebGaramond.variable} ${geist.variable} ${cormorant.variable} ${inter.variable}`}>
      <body className="font-sans antialiased text-[#e5e1e4] bg-[#131315] selection:bg-[#c9a461]/30 selection:text-[#e5e1e4]">
        <AuthProvider>
          <CartProvider>
            <div className="flex min-h-screen flex-col bg-[#131315] text-[#e5e1e4] pb-20 md:pb-0">
              <Header />
              <main className="flex-grow">{children}</main>
              <Footer />
              <BottomNav />
            </div>
            <Toaster 
              position="bottom-right" 
              toastOptions={{ 
                duration: 3000,
                style: {
                  background: '#16151A',
                  color: '#e5e1e4',
                  border: '1px solid rgba(232, 193, 123, 0.25)',
                  boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.8)',
                  fontSize: '13px',
                  fontFamily: 'var(--font-inter), sans-serif',
                },
                success: {
                  iconTheme: {
                    primary: '#e8c17b',
                    secondary: '#131315',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ffb4ab',
                    secondary: '#690005',
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

