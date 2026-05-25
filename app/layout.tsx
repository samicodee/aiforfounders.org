import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "AI for Founders | Practical AI for Business Owners",
    template: "%s | AI for Founders",
  },
  description:
    "A practical AI implementation workshop for founders, business owners, and SME leaders who want AI workflows for sales, operations, hiring, and founder leverage.",
  metadataBase: new URL("https://www.aiforfounders.org"),
  openGraph: {
    title: "AI for Founders | Practical AI for Business Owners",
    description:
      "Founder-led applied AI education for business owners who want practical workflows, not theory.",
    url: "https://www.aiforfounders.org",
    siteName: "AI for Founders",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
