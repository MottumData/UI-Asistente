import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chani - Tu asistente Documental",
  description: "Asistente documental para Codexca",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}