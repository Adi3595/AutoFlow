import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AutoFlow | Autonomous Workflow Infrastructure",
  description: "AutoFlow is an AI-native automation ecosystem combining conversational AI, autonomous agents, and intelligent execution pipelines for enterprise scale.",
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
  openGraph: {
    title: "AutoFlow | Autonomous Workflow Infrastructure",
    description: "The intelligent canvas that translates natural language directly into executing, self-healing backend architecture.",
    url: "https://autoflowos.example.com",
    siteName: "AutoFlow",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AutoFlow | Autonomous Workflow Infrastructure",
    description: "The intelligent canvas that translates natural language directly into executing, self-healing backend architecture.",
  },
  robots: {
    index: true,
    follow: true,
  }
};

import { InteractiveBackground } from "@/components/ui/InteractiveBackground";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <InteractiveBackground />
        {children}
      </body>
    </html>
  );
}
