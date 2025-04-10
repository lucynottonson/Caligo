import type { Metadata } from "next";
import { Chivo_Mono } from "next/font/google";
import "./globals.css";

const chivoMono = Chivo_Mono({
  variable: "--font-chivo-mono", 
  subsets: ["latin"],            
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"], 
});

export const metadata: Metadata = {
  title: "Caligo",
  description: "this is Caligo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${chivoMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
