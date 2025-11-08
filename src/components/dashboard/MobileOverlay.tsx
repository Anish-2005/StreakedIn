"use client";

interface MobileOverlayProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function MobileOverlay({ isVisible, onClose }: MobileOverlayProps) {
  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-40 md:hidden"
      onClick={onClose}
    />
  );
}