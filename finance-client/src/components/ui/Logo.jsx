import React from "react";

export default function Logo({ size = 48 }) {
    return (
    <svg className="logo" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="1" y2="0">
          <stop offset="0%" stopColor="#2dd4bf" />
          <stop offset="100%" stopColor="#60a5fa" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="60" height="60" rx="14" fill="url(#g)" />
      <path d="M16 40 L26 28 L34 36 L48 20" stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round" />
      <circle cx="48" cy="20" r="3" fill="#fff" />
    </svg>
  );
}
