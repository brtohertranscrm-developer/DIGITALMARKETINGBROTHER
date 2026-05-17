import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Brothers Trans Marketing Dashboard",
  description: "Dashboard reporting dan performa digital marketing Brothers Trans",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
