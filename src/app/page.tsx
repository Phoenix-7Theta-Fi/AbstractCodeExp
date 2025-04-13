// AbstractSnippet: LANDING001
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-8">
      <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
        Welcome to the Healthcare App
      </h1>
      <p className="text-lg text-gray-300">
        Please proceed to your dashboard to manage healthcare services.
      </p>
      <Link
        href="/dashboard"
        className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
