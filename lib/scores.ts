import type { SavedScore, LeaderboardEntry } from "./types";

export function getScoresByGame(gameId: string): SavedScore[] {
  try {
    const all: SavedScore[] = JSON.parse(
      localStorage.getItem("av_scores") || "[]"
    );
    return all.filter((s) => s.game === gameId);
  } catch (e) {
    return [];
  }
}

export function getTopScores(
  gameId: string,
  limit: number = 12
): LeaderboardEntry[] {
  const scores = getScoresByGame(gameId);

  // Sort by score descending
  const sorted = scores.sort((a, b) => b.score - a.score);

  // Take top N
  const top = sorted.slice(0, limit);

  // Convert to LeaderboardEntry format
  return top.map((s, i) => ({
    rank: i + 1,
    name: s.name,
    score: s.score,
    date: new Date(s.at).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
  }));
}

export function getUserBestScore(
  gameId: string,
  userName: string
): SavedScore | null {
  const scores = getScoresByGame(gameId);
  const userScores = scores.filter((s) => s.name === userName);

  if (userScores.length === 0) return null;

  // Return highest score
  return userScores.reduce((best, current) =>
    current.score > best.score ? current : best
  );
}
