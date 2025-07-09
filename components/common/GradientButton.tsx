// components/ui/GradientButton.tsx
import React from 'react';

interface GradientButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  ariaLabel: string;
}

const GradientButton: React.FC<GradientButtonProps> = ({
  children,
  onClick,
  disabled = false,
  className = '',
  ariaLabel,
}) => {
  return (
    <div
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick && onClick()}
      role="button"
      tabIndex={0}
      className={`relative overflow-hidden px-6 py-3 rounded-lg bg-gradient-to-r from-[#4964A9] to-[#022171] text-white font-semibold text-lg transition-all duration-300 ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 cursor-pointer'
      } ${className}`}
      aria-label={ariaLabel}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      {/* Shine effect */}
      {!disabled && (
        <span className="absolute top-0 left-[-75%] w-2/3 h-full bg-gradient-to-r from-white/60 via-white/20 to-transparent opacity-70 blur-sm pointer-events-none animate-shine" />
      )}
      {children}
    </div>
  );
};

export default GradientButton;