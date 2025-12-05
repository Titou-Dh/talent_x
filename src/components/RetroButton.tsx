import React from "react";
import { Link } from "@/navigation";

interface RetroButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  href?: string;
}

export const RetroButton = ({
  children,
  onClick,
  variant = "primary",
  className = "",
  type = "button",
  disabled = false,
  href,
}: RetroButtonProps) => {
  const baseStyle =
    "font-vt323 px-6 py-2 uppercase tracking-widest text-xl border-2 transition-all active:translate-y-1 focus:outline-none flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed inline-flex";

  const variants = {
    primary:
      "border-white text-white hover:bg-white hover:text-black hover:shadow-[0_0_15px_rgba(255,255,255,0.4)]",
    secondary:
      "border-gray-500 text-gray-300 hover:border-white hover:text-white hover:bg-gray-900",
    danger:
      "border-white text-white hover:bg-white hover:text-black decoration-double underline",
    ghost: "border-transparent text-gray-400 hover:text-white",
  };

  const classes = `${baseStyle} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {variant !== "ghost" && <span className="text-xs">{">"}</span>}
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={classes}
    >
      {variant !== "ghost" && <span className="text-xs">{">"}</span>}
      {children}
    </button>
  );
};
