import type { Metadata } from "next";
import { Poppins } from "next/font/google"; // Ensure you are using this if needed
import localFont from "next/font/local";
import "./globals.css";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { ToastProvider } from "../providers/toast-provider";
import React from "react";

// Metadata for the app
export const metadata: Metadata = {
  title: "JobLo",
  description: "Online Job Portal",
};

// Root layout component
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="antialiased">
          {children}
          <ToastProvider />
        </body>
      </html>
    </ClerkProvider>
  );
}
