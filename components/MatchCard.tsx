"use client";

import { formatTeam } from "@/lib/teamFormat";

type Props = {
  game: any;
  title?: string;
  variant?: "upcoming" | "completed";
};

export default function MatchCard({
  game,
  title,
  variant = "upcoming",
}: Props) {
  if (!game) return null;

  return (
    <div className="rounded-2xl shadow-lg border bg-white overflow-hidden">
      {/* HEADER STRIP */}
      <div className="bg-black text-white px-4 py-2 flex justify-between items-center">
        <div className="text-sm font-semibold">{title ?? "MATCH"}</div>

        <div
          className={`text-xs px-2 py-1 rounded-full ${
            variant === "upcoming" ? "bg-blue-500" : "bg-green-600"
          }`}
        >
          {variant === "upcoming" ? "UPCOMING" : "FINAL"}
        </div>
      </div>

      {/* TEAMS */}
      <div className="grid grid-cols-2 divide-x">
        {/* WHITE */}
        <div className="p-6 text-center">
          <div className="text-xs text-gray-500 mb-1">HOME</div>
          <div className="text-xl font-bold">{formatTeam(game.white)}</div>
          {game.whiteScore != null && (
            <div className="text-3xl font-bold mt-2">{game.whiteScore}</div>
          )}
        </div>

        {/* DARK */}
        <div className="p-6 text-center">
          <div className="text-xs text-gray-500 mb-1">AWAY</div>
          <div className="text-xl font-bold">{formatTeam(game.dark)}</div>
          {game.darkScore != null && (
            <div className="text-3xl font-bold mt-2">{game.darkScore}</div>
          )}
        </div>
      </div>

      {/* META BAR */}
      <div className="bg-gray-50 px-4 py-3 flex justify-between text-sm text-gray-700">
        <div>🕒 {game.time}</div>
        <div>📍 {game.location}</div>
        <div>🏟️ Game {game.gameId}</div>
      </div>
    </div>
  );
}
