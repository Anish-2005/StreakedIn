"use client";

interface ToggleAuthModeProps {
  isSignUp: boolean;
  onToggle: () => void;
}

export default function ToggleAuthMode({ isSignUp, onToggle }: ToggleAuthModeProps) {
  return (
    <div className="mt-6 text-center">
      <button
        onClick={onToggle}
        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors text-sm"
      >
        {isSignUp
          ? 'Already have an account? Sign in'
          : "Don't have an account? Sign up"
        }
      </button>
    </div>
  );
}