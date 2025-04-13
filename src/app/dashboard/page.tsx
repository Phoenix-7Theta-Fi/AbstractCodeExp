// AbstractSnippet: DASH001
import DietAnalytics from '@/components/DietAnalytics/DietAnalytics';

export default function Dashboard() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-8">
      <div className="space-y-6 max-w-2xl text-center">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
          Welcome to Healthcare Dashboard
        </h1>
        <p className="text-lg text-gray-300">
          Your central hub for managing healthcare services and patient care
        </p>
      </div>
      <DietAnalytics />
    </div>
  );
}
