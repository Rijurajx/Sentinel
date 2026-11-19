import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "SENTINEL — Financial Threat Intelligence & Protection Platform",
  description:
    "Detect the threat. Understand the network. Protect the money. Linear-grade financial threat intelligence and verification.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#08090a] text-[#f7f8f8] selection:bg-[#5e6ad2]/30 selection:text-[#f7f8f8]">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
