import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Velocity · Customer Context Layer",
  description:
    "The layer that answers: what does THIS agent need to know about THIS customer to do THIS job, right now.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
