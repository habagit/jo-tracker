"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [team, setTeam] = useState("");
  const router = useRouter();

  const search = () => {
    if (team.toLowerCase().includes("west valley")) {
      router.push("/team/west-valley-16u-boys");
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-5xl font-bold">JO Tracker</h1>

      <p className="mt-4">Find your next game</p>

      <input
        className="border rounded-lg p-3 mt-8 w-80"
        placeholder="Search team..."
        value={team}
        onChange={(e) => setTeam(e.target.value)}
      />

      <button
        onClick={search}
        className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg"
      >
        Search
      </button>
    </main>
  );
}
