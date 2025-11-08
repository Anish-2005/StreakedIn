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
        className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
      >
        {isSignUp
          ? 'Already have an account? Sign in'
          : "Don't have an account? Sign up"
        }
      </button>
    </div>
  );
}