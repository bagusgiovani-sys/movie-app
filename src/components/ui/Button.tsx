import React, { useState } from "react";

type ButtonProps = {
  children?: React.ReactNode;
  variant?: "primary" | "secondary" | "favorite";
  onClick?: () => void;
  className?: string;
  isFavorite?: boolean;
  compact?: boolean;
  size?: "xs" | "sm" | "lg";
  disabled?: boolean;
};

const Button = ({
  children,
  variant = "primary",
  onClick,
  className = "",
  isFavorite = false,
  compact = false,
  size = "lg",
  disabled = false,
}: ButtonProps) => {
  const [justClicked, setJustClicked] = useState(false);

  const handleFavoriteClick = () => {
    onClick?.();
    setJustClicked(true);
    setTimeout(() => setJustClicked(false), 600);
  };

  if (variant === "favorite") {
    return (
      <button
        onClick={handleFavoriteClick}
        className={`
          ${size === "lg" ? "w-16 h-16" : size === "sm" ? "w-14 h-14" : "w-10 h-10"}
          rounded-xl flex items-center justify-center transition-all duration-200
          ${justClicked ? "pointer-events-none" : ""}
          ${isFavorite
            ? "bg-red-600 hover:bg-red-700"
            : "bg-transparent border-2 border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800/50"
          }
          ${className}
        `}
      >
        <svg
          className={`${size === "lg" ? "w-7 h-7" : size === "sm" ? "w-6 h-6" : "w-5 h-5"} ${isFavorite ? "fill-white" : "fill-none"} transition-colors duration-200`}
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>
    );
  }

  if (variant === "secondary") {
    return (
      <button
        onClick={onClick}
        className={`w-full sm:w-auto rounded-xl border border-white/30 px-10 py-4 font-semibold hover:bg-white/10 transition-all duration-200 ${className}`}
      >
        {children}
      </button>
    );
  }

  const padding = compact ? "px-5 py-2.5 text-sm" : "px-8 py-4";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full sm:w-auto flex items-center justify-center sm:justify-start gap-4 rounded-xl font-semibold transition-all duration-200 bg-(--color-primary-300) hover:bg-(--color-primary-400) ${padding} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;