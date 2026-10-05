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
    <html lang="en" className={`${ebGaramond.variable} ${geist.variable} ${cormorant.variable} ${inter.variable}`}>
      <body className="font-sans antialiased text-[#282421] bg-[#F7F4EE] selection:bg-[#5B3C58]/20 selection:text-[#282421]">
        <AuthProvider>
          <CartProvider>
            <div className="flex min-h-screen flex-col bg-[#F7F4EE] text-[#282421] pb-20 md:pb-0">
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
                  background: '#F7F4EE',
                  color: '#282421',
                  border: '1px solid rgba(40, 36, 33, 0.12)',
                  boxShadow: '0 4px 20px rgba(40, 36, 33, 0.08)',
                  fontSize: '13px',
                  fontFamily: 'var(--font-inter), sans-serif',
                },
                success: {
                  iconTheme: {
                    primary: '#5B3C58',
                    secondary: '#F7F4EE',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#C53030',
                    secondary: '#FFF5F5',
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

