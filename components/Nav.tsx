"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import type { User } from "@/lib/types";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Load user from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("av_user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Error loading user:", e);
    }
  }, []);

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

  const handleSignOut = () => {
    try {
      localStorage.removeItem("av_user");
      setUser(null);
      setOpen(false);
      router.push("/");
    } catch (e) {
      console.error("Error signing out:", e);
    }
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

        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span className="pixel neon-cyan" style={{ fontSize: 11 }}>
              {user.name}
            </span>
            <button className="btn ghost" onClick={handleSignOut}>
              Cerrar Sesión
            </button>
          </div>
        ) : (
          <Link href="/auth" className="btn auth-btn">
            Iniciar Sesión
          </Link>
        )}

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

        {user ? (
          <>
            <div
              className="pixel neon-cyan"
              style={{
                fontSize: 11,
                marginTop: 16,
                paddingTop: 16,
                borderTop: "1px solid var(--border)",
              }}
            >
              {user.name}
            </div>
            <button
              className="btn ghost"
              style={{ marginTop: 8, width: "100%" }}
              onClick={handleSignOut}
            >
              Cerrar Sesión
            </button>
          </>
        ) : (
          <Link
            href="/auth"
            className={isActive("/auth") ? "active" : ""}
            onClick={() => go("/auth")}
          >
            Iniciar Sesión
          </Link>
        )}

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
