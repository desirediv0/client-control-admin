import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GraphqlProvider } from "@/provider/GraphProvider";
import NextAuthProvider from "@/provider/NextAuthProvider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ClientGuard",
  description: "ClientGuard - Revolutionize Your Agency's Client Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} select-none`}>
        <GraphqlProvider>
          <NextAuthProvider>
            {children}
            <Toaster />
          </NextAuthProvider>
        </GraphqlProvider>
      </body>
    </html>
  );
}
