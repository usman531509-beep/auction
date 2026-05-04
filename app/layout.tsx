import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "クルマリンク — Car Store",
  description: "Premium cars at transparent prices.",
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
