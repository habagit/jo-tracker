"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { formatTeam } from "@/lib/teamFormat";
import MatchCard from "@/components/MatchCard";

export default function TeamPage({
  params,
}: {
  params: Promise<{ division: string; team: string }>;
}) {
  const resolvedParams = use(params);

  const division = decodeURIComponent(resolvedParams.division ?? "");
  const team = decodeURIComponent(resolvedParams.team ?? "");

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!division || !team) return;

      setLoading(true);

      try {
        const res = await fetch(
          `/api/tournament?division=${encodeURIComponent(
            division,
          )}&team=${encodeURIComponent(team)}`,
          { cache: "no-store" },
        );

        const json = await res.json();
        setData(json);
      } catch (e) {
        setData({ error: "fetch failed" });
      }

      setLoading(false);
    }

    load();
  }, [division, team]);

  if (loading) {
    return (
      <div className="p-10 text-lg font-semibold">Loading schedule...</div>
    );
  }

  if (!data || data.error) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold">Team Not Found</h1>
        <pre className="text-sm mt-4 bg-gray-100 p-3 rounded">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    );
  }

  const next = data.nextGame;
  const latest = data.latestGame;

  return (
    <main className="p-6 max-w-4xl mx-auto">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{team}</h1>
        <div className="text-gray-600">{division}</div>

        <div className="flex gap-6 mt-3 text-lg">
          <div>🏆 Wins: {data.wins ?? 0}</div>
          <div>💔 Losses: {data.losses ?? 0}</div>
        </div>
      </div>

      {/* UPCOMING */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-3">Upcoming Match</h2>

        {data.nextGame ? (
          <MatchCard
            game={data.nextGame}
            title="NEXT GAME"
            variant="upcoming"
          />
        ) : (
          <div className="text-gray-500">No upcoming game</div>
        )}
      </div>

      {/* LAST GAME */}
      <div>
        <h2 className="text-xl font-bold mb-3">Recent Match</h2>

        {data.latestGame ? (
          <MatchCard
            game={data.latestGame}
            title="LAST GAME"
            variant="completed"
          />
        ) : (
          <div className="text-gray-500">No completed games yet</div>
        )}
      </div>
    </main>
  );
}
