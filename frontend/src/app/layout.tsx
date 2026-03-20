import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ReduxProvider } from "@/components/redux-provider";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JobHub - Find Your Dream Job",
  description:
    "Discover thousands of job opportunities from top companies. Connect with recruiters and land your next career move.",
};

import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <ReduxProvider>
          {children}
          <Toaster position="top-center" />
        </ReduxProvider>
        <Analytics />
      </body>
    </html>
  );
}
