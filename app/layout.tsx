import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TeachLens",
  description: "Animated visual lessons and worked examples for clear study",
  icons: {
    icon: "/brand/teachlens-icon.png",
    apple: "/brand/teachlens-icon.png"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
