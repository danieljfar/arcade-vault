"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GAMES } from "@/lib/data";
import { getTopScores, getUserBestScore } from "@/lib/scores";
import type { User, LeaderboardEntry, SavedScore } from "@/lib/types";

export default function Salon() {
  const router = useRouter();
  const [tab, setTab] = useState(GAMES[0].id);
  const [user, setUser] = useState<User | null>(null);
  const [scores, setScores] = useState<LeaderboardEntry[]>([]);
  const [userBest, setUserBest] = useState<SavedScore | null>(null);

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

  // Load scores for current game
  useEffect(() => {
    const topScores = getTopScores(tab, 12);
    setScores(topScores);

    if (user) {
      const best = getUserBestScore(tab, user.name);
      setUserBest(best);
    } else {
      setUserBest(null);
    }
  }, [tab, user]);

  const currentGame = GAMES.find((g) => g.id === tab);

  return (
    <div className="av-hall fade-in">
      <div className="hall-head">
        <div className="mark"></div>
        <h1 className="neon-cyan">SALÓN DE LA FAMA</h1>
        <div
          className="mono"
          style={{
            fontSize: 11,
            color: "var(--ink-faint)",
            letterSpacing: "0.16em",
            marginTop: 8,
          }}
        >
          RANKINGS GLOBALES · COMPETICIÓN ARCADE
        </div>
      </div>

      <div className="hall-tabs">
        {GAMES.map((g) => (
          <button
            key={g.id}
            className={`chip ${tab === g.id ? "on" : ""}`}
            onClick={() => setTab(g.id)}
          >
            {g.title}
          </button>
        ))}
      </div>

      {scores.length === 0 ? (
        <div
          className="mono"
          style={{
            textAlign: "center",
            padding: "60px 20px",
            color: "var(--ink-faint)",
            fontSize: 13,
            letterSpacing: "0.1em",
          }}
        >
          NO HAY PUNTUACIONES REGISTRADAS TODAVÍA.
          <br />
          ¡SÉ EL PRIMERO EN JUGAR!
        </div>
      ) : (
        <>
          {/* Podium - Top 3 */}
          {scores.length >= 3 && (
            <div className="podium">
              {/* Silver - 2nd place (left) */}
              <div className="podium-place silver">
                <div className="podium-rank">2</div>
                <div className="podium-name">{scores[1].name}</div>
                <div className="podium-score">
                  {scores[1].score.toLocaleString()}
                </div>
              </div>

              {/* Gold - 1st place (center, tallest) */}
              <div className="podium-place gold">
                <div className="podium-rank">1</div>
                <div className="podium-name">{scores[0].name}</div>
                <div className="podium-score">
                  {scores[0].score.toLocaleString()}
                </div>
              </div>

              {/* Bronze - 3rd place (right) */}
              <div className="podium-place bronze">
                <div className="podium-rank">3</div>
                <div className="podium-name">{scores[2].name}</div>
                <div className="podium-score">
                  {scores[2].score.toLocaleString()}
                </div>
              </div>
            </div>
          )}

          {/* Full Table - Top 12 */}
          <div className="hall-table">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>JUGADOR</th>
                  <th>PUNTUACIÓN</th>
                  <th>FECHA</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((s, i) => (
                  <tr key={i} className="slide-in" style={{ animationDelay: `${i * 40}ms` }}>
                    <td>
                      <span className={`rank rank-${i + 1}`}>{s.rank}</span>
                    </td>
                    <td className="name">{s.name}</td>
                    <td className="score">{s.score.toLocaleString()}</td>
                    <td className="date">{s.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* User Best Score Section */}
      {user && userBest && (
        <div className="user-best">
          <div className="user-best-header">
            <span className="neon-yellow">▸</span> TU MEJOR MARCA
          </div>
          <div className="user-best-content">
            <div className="user-best-stat">
              <div className="label">Puntuación</div>
              <div className="value neon-cyan">
                {userBest.score.toLocaleString()}
              </div>
            </div>
            <div className="user-best-stat">
              <div className="label">Fecha</div>
              <div className="value">
                {new Date(userBest.at).toLocaleDateString("es-ES", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      <button
        className="btn lg"
        style={{ marginTop: 32, width: "100%", maxWidth: 400 }}
        onClick={() => router.push("/")}
      >
        ◀ VOLVER A LA BIBLIOTECA
      </button>
    </div>
  );
}
