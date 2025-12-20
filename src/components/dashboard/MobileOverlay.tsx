"use client";

interface MobileOverlayProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function MobileOverlay({ isVisible, onClose }: MobileOverlayProps) {
  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 dark:bg-black/50 light:bg-gray-900/30 z-40 md:hidden"
      onClick={onClose}
    />
  );
}