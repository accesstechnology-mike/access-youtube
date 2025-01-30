import "./globals.css";
import { GoogleAnalytics } from '@next/third-parties/google';

export const viewport = {
  themeColor: "#2e1433",
  width: "device-width",
  initialScale: 1,
  interactiveWidget: "resizes-content"
};

export const metadata = {
  title: "access: youtube - Enhanced Accessibility YouTube Search",
  description: "Search YouTube videos with enhanced accessibility features",
  icons: {
    icon: '/favicon.ico',
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    title: "access:youtube",
    statusBarStyle: "default",
  },
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
