"use client";

interface SearchResult {
  id: string;
  title: string;
  description?: string;
  category?: string;
  progress?: number;
  priority?: string;
  completed?: boolean;
}

interface SearchResultsProps {
  searchQuery: string;
  searchResults: {
    goals: SearchResult[];
    tasks: SearchResult[];
  };
  isSearching: boolean;
  onClearSearch: () => void;
  onTabChange: (tab: string) => void;
}

export default function SearchResults({
  searchQuery,
  searchResults,
  isSearching,
  onClearSearch,
  onTabChange
}: SearchResultsProps) {
  if (!searchQuery) return null;

  return (
    <div className="px-4 sm:px-6 py-4 border-b border-slate-700/50 bg-slate-800/20">
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">
            Search Results for "{searchQuery}"
          </h2>
          <button
            onClick={onClearSearch}
            className="text-slate-400 hover:text-white text-sm"
          >
            Clear
          </button>
        </div>

        {isSearching ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-slate-400 mt-2">Searching...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Goals Results */}
            {searchResults.goals.length > 0 && (
              <div>
                <h3 className="text-md font-medium text-blue-300 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Goals ({searchResults.goals.length})
                </h3>
                <div className="space-y-2">
                  {searchResults.goals.slice(0, 5).map((goal) => (
                    <div
                      key={goal.id}
                      className="p-3 bg-slate-800/40 rounded-lg border border-slate-700/40 hover:border-slate-600/60 transition-colors cursor-pointer"
                      onClick={() => onTabChange('goals')}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-white truncate">{goal.title}</h4>
                          <p className="text-sm text-slate-400 truncate">{goal.description || 'No description'}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">
                            {goal.category}
                          </span>
                          <span className="text-xs text-slate-500">
                            {goal.progress}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tasks Results */}
            {searchResults.tasks.length > 0 && (
              <div>
                <h3 className="text-md font-medium text-green-300 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Tasks ({searchResults.tasks.length})
                </h3>
                <div className="space-y-2">
                  {searchResults.tasks.slice(0, 5).map((task) => (
                    <div
                      key={task.id}
                      className="p-3 bg-slate-800/40 rounded-lg border border-slate-700/40 hover:border-slate-600/60 transition-colors cursor-pointer"
                      onClick={() => onTabChange('tasks')}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-white truncate">{task.title}</h4>
                          <p className="text-sm text-slate-400 truncate">{task.description || 'No description'}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            task.priority === 'high' ? 'bg-red-500/20 text-red-300' :
                            task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                            'bg-green-500/20 text-green-300'
                          }`}>
                            {task.priority}
                          </span>
                          <span className={`text-xs ${task.completed ? 'text-green-400' : 'text-slate-500'}`}>
                            {task.completed ? '✓' : '○'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {searchResults.goals.length === 0 && searchResults.tasks.length === 0 && !isSearching && (
              <div className="text-center py-8">
                <p className="text-slate-400">No results found for "{searchQuery}"</p>
                <p className="text-slate-500 text-sm mt-1">Try searching for goals, tasks, or categories</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}