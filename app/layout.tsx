import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Global/Header/Header";
import Footer from "./components/Global/Footer/Footer";
import { getCurrentUser } from "@/server/services/auth.service";
import { WEBSITE_BASE_NAME } from "@/server/lib/constants";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: WEBSITE_BASE_NAME,
    template: `%s | ${WEBSITE_BASE_NAME}`,
  },
  description: WEBSITE_BASE_NAME,
};

export default async function RootLayout({ children }: LayoutProps<"/">) {

  const user = await getCurrentUser();
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="page-shell">
        <Header user={user}/>
        <main className="page-content">
          {children}
        </main>
        <Footer/>
      </body>
    </html>
  );
}
