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
        className="text-purple-500 hover:text-purple-400 transition-colors text-sm"
      >
        {isSignUp
          ? 'Already have an account? Sign in'
          : "Don't have an account? Sign up"
        }
      </button>
    </div>
  );
}