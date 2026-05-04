"use client";
import { SessionProvider } from "next-auth/react";
import { SWRConfig } from "swr";
import { Toaster } from "sonner";
import { fetcher } from "@/lib/fetcher";
import { CartProvider } from "@/components/cart/CartProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SWRConfig value={{ fetcher, revalidateOnFocus: false }}>
        <CartProvider>
          {children}
          <Toaster richColors position="top-right" />
        </CartProvider>
      </SWRConfig>
    </SessionProvider>
  );
}
