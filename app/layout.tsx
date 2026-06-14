import type { Metadata } from "next";
import { Press_Start_2P, Courier_Prime } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start",
  display: "swap",
});

const courierPrime = Courier_Prime({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-courier-prime",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Arcade Vault",
  description: "Retro arcade game portal - Inserta una moneda para jugar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${pressStart2P.variable} ${courierPrime.variable}`}
      style={{
        height: "100%",
      }}
    >
      <body
        style={{
          minHeight: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Nav />

        <main className="av-main">{children}</main>

        <footer
          style={{
            borderTop: "1px solid var(--line)",
            padding: "20px 32px",
            textAlign: "center",
            color: "var(--ink-faint)",
            fontFamily: "var(--mono)",
            fontSize: 11,
            letterSpacing: "0.16em",
          }}
        >
          © 2026 ARCADE VAULT · HECHO CON PIXELES Y NEÓN · v2.6.0
        </footer>
      </body>
    </html>
  );
}
