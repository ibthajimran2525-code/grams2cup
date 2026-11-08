import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL("https://grams2cup.com"),
  title: { default: "grams2cup: Grams to Cups Converter for Every Ingredient", template: "%s" },
  description: "Ingredient-specific grams to cups converter for flour, sugar, butter and more, with US, metric and UK cup standards.",
  robots: { index: true, follow: true },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#0F766E" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased">
        {children}
        <footer className="mx-auto max-w-3xl px-4 pb-10 pt-4 text-sm text-slate-600">
          <p>© {new Date().getFullYear()} grams2cup. Conversions use ingredient density, not a single ratio.</p>
        </footer>
      </body>
    </html>
  );
}
