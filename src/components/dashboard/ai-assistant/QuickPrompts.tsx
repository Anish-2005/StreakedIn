"use client";

interface QuickPromptsProps {
  prompts: string[];
  onPromptClick: (prompt: string) => void;
}

export default function QuickPrompts({ prompts, onPromptClick }: QuickPromptsProps) {
  const handlePromptClick = (prompt: string) => {
    onPromptClick(prompt);
  };

  return (
    <div className="bg-app-surface/50 border border-app-border/30 backdrop-blur-sm rounded-2xl p-6">
      <h3 className="font-semibold text-app-text mb-4 text-base">Quick Prompts</h3>
      <div className="space-y-2.5">
        {prompts.map((prompt, index) => (
          <button
            key={index}
            onClick={() => handlePromptClick(prompt)}
            className="w-full text-left p-3 rounded-lg border border-app-border/30 bg-app-bg/30 hover:bg-app-bg/60 hover:border-app-border/50 transition-all duration-200 text-sm text-app-text-muted hover:text-app-text"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}