import { teams } from "../../../data/teams";

export default async function TeamPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const team = teams.find((t) => t.slug === slug);

  if (!team) {
    return <div>Team not found</div>;
  }

  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-4xl font-bold">
        {team.name}
      </h1>

      <p className="text-xl mt-2">
        {team.division}
      </p>

      <div className="mt-8 border rounded-xl p-6">
        <h2 className="text-2xl font-semibold">
          Next Game
        </h2>

        <p className="mt-4">
          vs {team.nextGame.opponent}
        </p>

        <p>{team.nextGame.time}</p>

        <p>{team.nextGame.pool}</p>

        <p>Game #{team.nextGame.gameId}</p>
      </div>
    </main>
  );
}