import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AutoFlux | Autonomous Workflow Infrastructure",
  description: "AutoFlux is an AI-native automation ecosystem combining conversational AI, autonomous agents, and intelligent execution pipelines for enterprise scale.",
  openGraph: {
    title: "AutoFlux | Autonomous Workflow Infrastructure",
    description: "The intelligent canvas that translates natural language directly into executing, self-healing backend architecture.",
    url: "https://autofluxos.example.com",
    siteName: "AutoFlux",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AutoFlux | Autonomous Workflow Infrastructure",
    description: "The intelligent canvas that translates natural language directly into executing, self-healing backend architecture.",
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
