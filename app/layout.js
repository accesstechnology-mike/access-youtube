import "./globals.css";

export const viewport = {
  themeColor: "#2e1433",
};

export const metadata = {
  title: "access: youtube - Enhanced Accessibility YouTube Search",
  description: "Search YouTube videos with enhanced accessibility features",
  icons: {
    icon: [
      { url: "/favicon/favicon.ico" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      {
        url: "/favicon/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/favicon/safari-pinned-tab.svg",
        color: "#2e1433",
      },
    ],
  },
  manifest: "/favicon/site.webmanifest",
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
      </body>
    </html>
  );
}
