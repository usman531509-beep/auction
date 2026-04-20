import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "クルマリンク — Car Auctions",
  description: "Modern car auction marketplace.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans antialiased bg-surface text-ink">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
