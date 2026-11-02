import type { Metadata, Viewport } from "next";
import OfflineSupport from "./offline-support";
import "./globals.css";

export const metadata: Metadata = {
  title: "Support",
  description:
    "A private, performer-centered space for peer support, wellbeing, and practical resources.",
  manifest: "/manifest.json",
  icons: { icon: "/support-icon.svg" },
  referrer: "no-referrer",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#FAF6F1" };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <OfflineSupport />
        {children}
      </body>
    </html>
  );
}
