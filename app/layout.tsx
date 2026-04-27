import type { Metadata } from "next";
import "video.js/dist/video-js.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "StreamFlix | OTT Homepage",
  description: "A Netflix-inspired OTT platform homepage built with Next.js and Tailwind CSS."
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
