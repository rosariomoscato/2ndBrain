import type { Metadata } from "next";
import { Orbitron, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "../styles/cyberpunk.css";
import { CyberHeader } from "@/components/layout/cyber-header";
import { CyberSidebar } from "@/components/layout/cyber-sidebar";
import { MainViewport } from "@/components/layout/main-viewport";
import { StarfieldBg } from "@/components/shared/starfield-bg";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { CyberThemeInjector } from "@/components/shared/cyber-theme-injector";
import { SystemSettingsProvider } from "@/components/shared/system-settings-provider";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const displayFont = Orbitron({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const bodyFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600", "700"],
});

const techFont = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-tech",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Second Brain - Cyberpunk Command Center",
  description: "Personal knowledge management system with cyberpunk aesthetic",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Second Brain",
  description:
    "Personal knowledge management system with cyberpunk command center interface",
  applicationCategory: "ProductivityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  author: {
    "@type": "Person",
    name: "Second Brain",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({ headers: await headers() });
  const isAuthenticated = !!session?.user;

  return (
    <html lang="it" suppressHydrationWarning className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${displayFont.variable} ${bodyFont.variable} ${techFont.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <CyberThemeInjector />
          <SystemSettingsProvider>
          <StarfieldBg />
          {isAuthenticated ? (
            <div className="flex flex-col h-screen overflow-hidden bg-space-black relative z-10">
              {/* Header */}
              <CyberHeader />

              {/* Main Content */}
              <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <CyberSidebar />

                {/* Viewport */}
                <MainViewport>{children}</MainViewport>
              </div>
            </div>
          ) : (
            <div className="min-h-screen bg-space-black flex items-center justify-center">
              <MainViewport>{children}</MainViewport>
            </div>
          )}
          <Toaster richColors position="top-right" />
          </SystemSettingsProvider>
         </ThemeProvider>
      </body>
    </html>
  );
}