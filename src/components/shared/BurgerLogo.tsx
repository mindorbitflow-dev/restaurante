import React from 'react';

export default function BurgerLogo({ className = 'w-8 h-8 text-amber-400' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Top Bun */}
      <path d="M4 11c0-4.2 3.6-7 8-7s8 2.8 8 7H4z" />
      {/* Sesame Seeds */}
      <circle cx="9" cy="7.2" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="12" cy="6" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="15" cy="7.2" r="0.6" fill="currentColor" stroke="none" />
      {/* Melted Cheese / Lettuce wave */}
      <path d="M3 13.2c1.2 0 1.8-.8 3-.8s1.8.8 3 .8 1.8-.8 3-.8 1.8.8 3 .8 1.8-.8 3-.8 1.8.8 3 .8" />
      {/* Burger Patty */}
      <rect x="3" y="15.2" width="18" height="2.2" rx="1.1" fill="currentColor" fillOpacity="0.25" />
      {/* Bottom Bun */}
      <path d="M4 19h16c0 1.6-2 3-8 3s-8-1.4-8-3z" />
    </svg>
  );
}
