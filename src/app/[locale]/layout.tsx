import type { Metadata } from "next";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Retro Talent Map",
  description: "The future of recruitment",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="bg-black text-white min-h-screen flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <Navbar />
            <main className="grow w-full max-w-7xl mx-auto p-6 md:p-12 mt-4">
              {children}
            </main>
            <footer className="text-center text-gray-600 text-sm p-8 border-t border-gray-900 uppercase tracking-widest">
              System Ready // MongoDB Connection: Active //{" "}
              {new Date().getFullYear()}
            </footer>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
