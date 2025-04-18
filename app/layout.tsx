// app/layout.tsx
import { ClerkProvider } from "@clerk/nextjs"; // <-- Import ClerkProvider
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Prompt Manager",
  description: "Organize and manage  your AI prompts efficiently.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // Wrap the entire HTML content with ClerkProvider
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
          {children} {/* The rest of the app renders inside the provider */}
        </body>
      </html>
    </ClerkProvider> // <-- Close ClerkProvider
  );
}