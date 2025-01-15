import "./globals.css";
import { GoogleAnalytics } from '@next/third-parties/google'

export const viewport = {
  themeColor: "#2e1433",
  width: "device-width",
  initialScale: 1
};

export const metadata = {
  title: "access: youtube - Enhanced Accessibility YouTube Search",
  description: "Search YouTube videos with enhanced accessibility features",
  icons: {
    icon: [
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: { url: "/favicon/android-chrome-512x512.png" },
    apple: { url: "/favicon/apple-touch-icon.png" },
    other: [
      {
        rel: "mask-icon",
        url: "/favicon/safari-pinned-tab.svg",
        color: "#2e1433",
      }
    ],
  },
  manifest: "/favicon/site.webmanifest",
  appleWebApp: {
    title: "access:youtube",
    statusBarStyle: "default",
    capable: true,
    startupImage: [
      { url: "/favicon/apple-touch-icon.png" }
    ]
  },
  applicationName: "access:youtube",
  openGraph: {
    type: "website",
    siteName: "access:youtube",
    title: "access: youtube - Enhanced Accessibility YouTube Search",
    description: "Search YouTube videos with enhanced accessibility features",
    images: [{ url: "/favicon/android-chrome-512x512.png" }]
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-dark text-light antialiased">
        {children}
        <GoogleAnalytics gaId="G-LGBJ3EV4V7" />
      </body>
    </html>
  );
}
