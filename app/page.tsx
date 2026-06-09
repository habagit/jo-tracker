"use client";

import { useState } from "react";
import divisionsData from "../data/divisions.json";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const divisions = Object.keys(divisionsData);

  const [division, setDivision] = useState(divisions[0]);
  const [team, setTeam] = useState("");

  const handleFind = () => {
    if (!team) return;

    const slug = `${division}-${team}`
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[()]/g, "");

    router.push(`/team/${slug}`);
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <h1 className="text-3xl font-bold text-center">JO Tracker</h1>

          <p className="text-center text-gray-500 mt-2">Junior Olympics 2026</p>

          <div className="mt-8">
            <label className="block text-sm font-semibold mb-2">Division</label>

            <select
              value={division}
              onChange={(e) => {
                setDivision(e.target.value);
                setTeam("");
              }}
              className="w-full p-4 text-lg border rounded-xl"
            >
              {divisions.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-semibold mb-2">Team</label>

            <select
              value={team}
              onChange={(e) => setTeam(e.target.value)}
              className="w-full p-4 text-lg border rounded-xl"
            >
              <option value="">Select Team</option>

              {divisionsData[division as keyof typeof divisionsData].map(
                (t) => (
                  <option key={t}>{t}</option>
                ),
              )}
            </select>
          </div>

          <button
            onClick={handleFind}
            disabled={!team}
            className="w-full mt-8 p-4 text-lg font-bold bg-blue-600 text-white rounded-xl disabled:bg-gray-300"
          >
            FIND MY TEAM
          </button>
        </div>
      </div>
    </main>
  );
}
