import React from "react";

interface CrossOrnamentProps {
  className?: string;
  size?: number;
}

export default function CrossOrnament({ className = "", size = 40 }: CrossOrnamentProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`text-orthodox-gold stroke-current ${className}`}
      aria-hidden="true"
    >
      {/* Outer elegant cross frame */}
      <path
        d="M50 5 L58 20 L75 12 L68 30 L88 35 L75 48 L95 50 L75 52 L88 65 L68 70 L75 88 L58 80 L50 95 L42 80 L25 88 L32 70 L12 65 L25 52 L5 50 L25 48 L12 35 L32 30 L25 12 L42 20 Z"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Intricate inner lattice and loops representing eternity */}
      <path
        d="M50 20 V80 M20 50 H80"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Diagonal design elements */}
      <path
        d="M30 30 L70 70 M30 70 L70 30"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="2 2"
      />
      {/* Central diamond */}
      <path
        d="M50 38 L62 50 L50 62 L38 50 Z"
        strokeWidth="2"
        fill="currentColor"
        fillOpacity="0.1"
      />
      {/* Ring around center */}
      <circle cx="50" cy="50" r="18" strokeWidth="1.5" strokeDasharray="4 2" />
      {/* Concentric details on the arms */}
      <circle cx="50" cy="15" r="3" fill="currentColor" />
      <circle cx="50" cy="85" r="3" fill="currentColor" />
      <circle cx="15" cy="50" r="3" fill="currentColor" />
      <circle cx="85" cy="50" r="3" fill="currentColor" />
    </svg>
  );
}
