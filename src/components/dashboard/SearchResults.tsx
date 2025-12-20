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
    <div className="px-4 sm:px-6 py-4 dark:border-b dark:border-slate-700/50 light:border-b light:border-gray-200 dark:bg-slate-800/20 light:bg-gray-100/20">
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold dark:text-white light:text-gray-900">
            Search Results for "{searchQuery}"
          </h2>
          <button
            onClick={onClearSearch}
            className="dark:text-slate-400 light:text-gray-500 dark:hover:text-white light:hover:text-gray-900 text-sm"
          >
            Clear
          </button>
        </div>

        {isSearching ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 dark:border-b-2 light:border-b-2 dark:border-blue-500 light:border-blue-600 mx-auto"></div>
            <p className="dark:text-slate-400 light:text-gray-500 mt-2">Searching...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Goals Results */}
            {searchResults.goals.length > 0 && (
              <div>
                <h3 className="text-md font-medium dark:text-blue-300 light:text-blue-600 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 dark:bg-blue-500 light:bg-blue-600 rounded-full"></span>
                  Goals ({searchResults.goals.length})
                </h3>
                <div className="space-y-2">
                  {searchResults.goals.slice(0, 5).map((goal) => (
                    <div
                      key={goal.id}
                      className="p-3 dark:bg-slate-800/40 light:bg-white/60 rounded-lg dark:border dark:border-slate-700/40 light:border light:border-gray-300/40 dark:hover:border-slate-600/60 light:hover:border-gray-400/60 transition-colors cursor-pointer"
                      onClick={() => onTabChange('goals')}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium dark:text-white light:text-gray-900 truncate">{goal.title}</h4>
                          <p className="text-sm dark:text-slate-400 light:text-gray-500 truncate">{goal.description || 'No description'}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <span className="px-2 py-1 dark:bg-blue-500/20 light:bg-blue-100 dark:text-blue-300 light:text-blue-700 text-xs rounded-full">
                            {goal.category}
                          </span>
                          <span className="text-xs dark:text-slate-500 light:text-gray-500">
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
                <h3 className="text-md font-medium dark:text-green-300 light:text-green-600 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 dark:bg-green-500 light:bg-green-600 rounded-full"></span>
                  Tasks ({searchResults.tasks.length})
                </h3>
                <div className="space-y-2">
                  {searchResults.tasks.slice(0, 5).map((task) => (
                    <div
                      key={task.id}
                      className="p-3 dark:bg-slate-800/40 light:bg-white/60 rounded-lg dark:border dark:border-slate-700/40 light:border light:border-gray-300/40 dark:hover:border-slate-600/60 light:hover:border-gray-400/60 transition-colors cursor-pointer"
                      onClick={() => onTabChange('tasks')}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium dark:text-white light:text-gray-900 truncate">{task.title}</h4>
                          <p className="text-sm dark:text-slate-400 light:text-gray-500 truncate">{task.description || 'No description'}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            task.priority === 'high' ? 'dark:bg-red-500/20 light:bg-red-100 dark:text-red-300 light:text-red-700' :
                            task.priority === 'medium' ? 'dark:bg-yellow-500/20 light:bg-yellow-100 dark:text-yellow-300 light:text-yellow-700' :
                            'dark:bg-green-500/20 light:bg-green-100 dark:text-green-300 light:text-green-700'
                          }`}>
                            {task.priority}
                          </span>
                          <span className={`text-xs ${task.completed ? 'dark:text-green-400 light:text-green-600' : 'dark:text-slate-500 light:text-gray-500'}`}>
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
                <p className="dark:text-slate-400 light:text-gray-500">No results found for "{searchQuery}"</p>
                <p className="dark:text-slate-500 light:text-gray-400 text-sm mt-1">Try searching for goals, tasks, or categories</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}