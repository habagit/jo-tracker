"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const DIVISIONS = ["16U BOYS", "16U GIRLS", "18U BOYS", "18U GIRLS"];

export default function DivisionTeamSelector() {
  const router = useRouter();

  const [division, setDivision] = useState(DIVISIONS[0]);
  const [teams, setTeams] = useState<string[]>([]);
  const [team, setTeam] = useState("");

  useEffect(() => {
    async function load() {
      setTeam("");

      const res = await fetch(
        `/api/teams?division=${encodeURIComponent(division)}`,
      );

      const data = await res.json();

      setTeams(data.teams || []);
    }

    load();
  }, [division]);

  function go() {
    if (!team) return;

    router.push(
      `/team/${encodeURIComponent(division)}/${encodeURIComponent(team)}`,
    );
  }

  return (
    <div className="p-4 max-w-md border rounded-lg space-y-4">
      <h2 className="text-lg font-bold">Tournament Lookup</h2>

      {/* Division */}
      <div>
        <label className="text-sm text-gray-500">Division</label>
        <select
          className="w-full border p-2 rounded"
          value={division}
          onChange={(e) => setDivision(e.target.value)}
        >
          {DIVISIONS.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
      </div>

      {/* Team */}
      <div>
        <label className="text-sm text-gray-500">Team</label>
        <select
          className="w-full border p-2 rounded"
          value={team}
          onChange={(e) => setTeam(e.target.value)}
        >
          <option value="">Select a team</option>
          {teams.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Button (RESTORED) */}
      <button
        onClick={go}
        disabled={!team}
        className="w-full bg-blue-600 text-white p-2 rounded disabled:opacity-40"
      >
        Select Team
      </button>
    </div>
  );
}
