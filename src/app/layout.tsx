import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Invoice Generator",
  description: "Generate Invoice & Surat Jalan dari Excel",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
