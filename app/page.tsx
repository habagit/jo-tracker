export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-5xl font-bold mb-6">JO Tracker</h1>

      <p className="text-lg text-gray-600 mb-8">Find your next game</p>

      <div className="w-full max-w-md">
        <input
          type="text"
          placeholder="Search team..."
          className="w-full border rounded-lg p-3"
        />

        <button className="w-full mt-4 bg-blue-600 text-white rounded-lg p-3">
          Search
        </button>
      </div>
    </main>
  );
}
