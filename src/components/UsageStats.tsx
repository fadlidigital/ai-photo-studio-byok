import { storage, UsageStats as StatsType } from '../services/storage';

interface UsageStatsProps {
  stats: StatsType;
}

export default function UsageStats({ stats }: UsageStatsProps) {
  const handleClearStats = () => {
    if (confirm('Are you sure you want to clear all usage statistics?')) {
      storage.clearAll();
      window.location.reload();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Usage Statistics</h2>
        <button
          onClick={handleClearStats}
          className="text-xs text-red-600 hover:text-red-700 font-medium"
        >
          Clear Stats
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-sm font-medium text-blue-900">Total Generations</span>
          </div>
          <p className="text-3xl font-bold text-blue-600">{stats.totalGenerations}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-medium text-purple-900">Total Images</span>
          </div>
          <p className="text-3xl font-bold text-purple-600">{stats.totalImages}</p>
        </div>
      </div>

      {stats.lastUsed && (
        <div className="mt-4 text-xs text-gray-500">
          Last used: {new Date(stats.lastUsed).toLocaleString('id-ID')}
        </div>
      )}
    </div>
  );
}
