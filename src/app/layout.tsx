import { Cormorant_Garamond, Manrope } from "next/font/google";
import type { Metadata, Viewport } from "next";
import { AppChrome } from "@/components/app-chrome";
import { CartProvider } from "@/components/cart-provider";
import { PwaRegister } from "@/components/pwa-register";
import { getSiteButtons, getVisibleCategories } from "@/lib/catalog";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
});

const manrope = Manrope({
  subsets: ["cyrillic", "latin"],
  variable: "--font-manrope",
});

const site = process.env.NEXT_PUBLIC_SITE_URL ?? "https://agray.art";

export const metadata: Metadata = {
  metadataBase: new URL(site),
  applicationName: "A.GRAY",
  title: {
    default: "A.GRAY — ювелирный дом",
    template: "%s · A.GRAY",
  },
  description:
    "Авторские украшения A.GRAY. Кольца, браслеты, кресты, серьги, подвески, иконы, цепи, обручальные и линия SPORT. Ателье Андрея.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  appleWebApp: {
    capable: true,
    title: "A.GRAY",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    title: "A.GRAY — ювелирный дом",
    description: "Чёрное и золото. Ручная работа.",
    url: site,
    locale: "ru_RU",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [navButtons, categories] = await Promise.all([
    getSiteButtons("nav"),
    getVisibleCategories(),
  ]);

  return (
    <html lang="ru" className={`${cormorant.variable} ${manrope.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-ink font-sans text-ivory antialiased">
        <CartProvider>
          <AppChrome navButtons={navButtons} categories={categories}>
            {children}
          </AppChrome>
          <PwaRegister />
        </CartProvider>
      </body>
    </html>
  );
}
