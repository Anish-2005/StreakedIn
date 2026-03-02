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
    <div className="bg-slate-800 light:bg-white/30 backdrop-blur-md border border-slate-700 light:border-slate-300/50 rounded-xl p-6">
      <h3 className="font-semibold text-white light:text-slate-900 mb-4">Quick Prompts</h3>
      <div className="space-y-2">
        {prompts.map((prompt, index) => (
          <button
            key={index}
            onClick={() => handlePromptClick(prompt)}
            className="w-full text-left p-3 rounded-lg border border-slate-700 light:border-slate-300/50 hover:border-blue-500/60 hover:bg-slate-700/40 transition-all duration-200 text-sm text-slate-300 light:text-slate-700"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}