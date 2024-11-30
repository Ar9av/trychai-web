import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import PlausibleProvider from "next-plausible";
import Image from 'next/image';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "TrychAI",
  description: "Generate Market Report on the fly",
  image: "/favicon.ico", // Changed image to favicon.ico
};

export default function RootLayout({ children }) {
  const domain = process.env.NEXT_PUBLIC_DOMAIN || "";
  const customDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_CUSTOM_DOMAIN;
  return (
    <html lang="en" className="dark">
      <head>
        <PlausibleProvider domain={domain} customDomain={customDomain} />
        <meta property="og:image" content={metadata.image} /> {/* Added meta tag for image */}
      </head>
      <body className={inter.className}>
        {/* <div className="header">
          <Image src={metadata.image} alt="TrychAI Logo" width={100} height={50} />
        </div> */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}