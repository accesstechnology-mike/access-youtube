import "./globals.css";

export const metadata = {
  title: "access: youtube - Enhanced Accessibility YouTube Search",
  description: "Search YouTube videos with enhanced accessibility features",
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
