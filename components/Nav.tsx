"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (route: string) => {
    if (route === "/") {
      return pathname === "/" || pathname.startsWith("/juego/");
    }
    return pathname === route;
  };

  const go = (path: string) => {
    setOpen(false);
    // Navigation handled by Link component
  };

  return (
    <>
      <nav className="av-nav">
        <Link href="/" className="logo" onClick={() => setOpen(false)}>
          <div className="logo-mark"></div>
          <div className="logo-text neon-cyan">
            ARCADE <span className="neon-magenta">VAULT</span>
          </div>
        </Link>

        <div className="links">
          <Link href="/" className={isActive("/") ? "active" : ""}>
            Biblioteca
          </Link>
          <Link href="/salon" className={isActive("/salon") ? "active" : ""}>
            Salón de la Fama
          </Link>
        </div>

        <div className="spacer"></div>

        <div className="coin-counter">
          <span className="coin"></span>
          <span>CRÉDITOS · 03</span>
        </div>

        <button className="btn auth-btn">Iniciar Sesión</button>

        <button
          className="btn ghost hamburger"
          onClick={() => setOpen(true)}
          aria-label="Menú"
        >
          ≡
        </button>
      </nav>

      <div
        className={`av-mobile-backdrop${open ? " open" : ""}`}
        onClick={() => setOpen(false)}
      ></div>

      <aside className={`av-mobile-panel${open ? " open" : ""}`}>
        <div
          className="pixel neon-cyan"
          style={{ fontSize: 11, marginBottom: 16 }}
        >
          MENÚ
        </div>

        <Link
          href="/"
          className={isActive("/") ? "active" : ""}
          onClick={() => go("/")}
        >
          Biblioteca
        </Link>

        <Link
          href="/salon"
          className={isActive("/salon") ? "active" : ""}
          onClick={() => go("/salon")}
        >
          Salón de la Fama
        </Link>

        <Link
          href="/auth"
          className={isActive("/auth") ? "active" : ""}
          onClick={() => go("/auth")}
        >
          Iniciar Sesión
        </Link>

        <div style={{ flex: 1 }}></div>

        <div
          className="pixel"
          style={{
            fontSize: 9,
            color: "var(--ink-faint)",
            letterSpacing: "0.16em",
          }}
        >
          CRÉDITOS · 03
        </div>
      </aside>
    </>
  );
}
