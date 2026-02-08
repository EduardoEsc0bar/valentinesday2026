import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Valentine Letter",
  description: "Scroll-driven Valentine envelope animation"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/fallback.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
