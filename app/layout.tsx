import type { Metadata } from "next";
import "./globals.css";
import "./experience.css";

export const metadata: Metadata = { title: "NeuroCuria · Rebis Engine", description: "A dual-lens AI reasoning instrument." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
