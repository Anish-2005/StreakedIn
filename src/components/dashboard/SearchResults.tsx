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
    <div className="px-4 sm:px-6 py-4 border-b border-app-border/70 bg-app-surface/35">
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-app-text">
            Search Results for "{searchQuery}"
          </h2>
          <button
            onClick={onClearSearch}
            className="text-app-text-muted hover:text-app-text text-sm"
          >
            Clear
          </button>
        </div>

        {isSearching ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-app-primary mx-auto"></div>
            <p className="text-app-text-muted mt-2">Searching...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {searchResults.goals.length > 0 && (
              <div>
                <h3 className="text-md font-medium text-app-primary mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-app-primary rounded-full"></span>
                  Goals ({searchResults.goals.length})
                </h3>
                <div className="space-y-2">
                  {searchResults.goals.slice(0, 5).map((goal) => (
                    <div
                      key={goal.id}
                      className="p-3 bg-app-surface rounded-xl border border-app-border hover:border-app-border-strong transition-colors cursor-pointer"
                      onClick={() => onTabChange('goals')}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-app-text truncate">{goal.title}</h4>
                          <p className="text-sm text-app-text-muted truncate">{goal.description || 'No description'}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <span className="px-2 py-1 bg-app-primary-soft text-app-primary text-xs rounded-full border border-app-primary/20">
                            {goal.category}
                          </span>
                          <span className="text-xs text-app-text-muted">
                            {goal.progress}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {searchResults.tasks.length > 0 && (
              <div>
                <h3 className="text-md font-medium text-app-success mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-app-success rounded-full"></span>
                  Tasks ({searchResults.tasks.length})
                </h3>
                <div className="space-y-2">
                  {searchResults.tasks.slice(0, 5).map((task) => (
                    <div
                      key={task.id}
                      className="p-3 bg-app-surface rounded-xl border border-app-border hover:border-app-border-strong transition-colors cursor-pointer"
                      onClick={() => onTabChange('tasks')}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-app-text truncate">{task.title}</h4>
                          <p className="text-sm text-app-text-muted truncate">{task.description || 'No description'}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <span className={`px-2 py-1 text-xs rounded-full border ${
                            task.priority === 'high'
                              ? 'bg-app-danger/15 text-app-danger border-app-danger/25'
                              : task.priority === 'medium'
                                ? 'bg-app-warning/15 text-app-warning border-app-warning/25'
                                : 'bg-app-success/15 text-app-success border-app-success/25'
                          }`}>
                            {task.priority}
                          </span>
                          <span className={`text-xs ${task.completed ? 'text-app-success' : 'text-app-text-muted'}`}>
                            {task.completed ? 'done' : 'open'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {searchResults.goals.length === 0 && searchResults.tasks.length === 0 && !isSearching && (
              <div className="text-center py-8">
                <p className="text-app-text-muted">No results found for "{searchQuery}"</p>
                <p className="text-app-text-muted/70 text-sm mt-1">Try searching for goals, tasks, or categories</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
