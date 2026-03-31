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
        className="text-app-primary hover:brightness-110 transition-colors text-sm font-medium"
      >
        {isSignUp
          ? 'Already have an account? Sign in'
          : "Don't have an account? Sign up"
        }
      </button>
    </div>
  );
}
