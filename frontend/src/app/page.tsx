import Navbar from "@/components/Navbar";

export default function HomePage() {
  return (
    <div>
      <Navbar />
      <main className="p-6">
        <h1 className="text-3xl font-bold mb-4">Welcome to Trendz Shop!</h1>
        {/* Your homepage content */}
      </main>
    </div>
  );
}
