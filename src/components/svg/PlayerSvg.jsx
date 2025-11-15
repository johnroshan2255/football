import React from "react";

export default function PlayerSvg({
  jersey = "#1f2937",
  gender = "male", // male | female
  size = 24,
  className = ""
}) {
  const skin = "#f7d6b8";
  const hair = "#2b2b2b";

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Head */}
      <circle cx="32" cy="14" r="8" fill={skin} />

      {/* Hair — changes based on gender */}
      {gender === "male" ? (
        <path d="M24 12c1.5-4 6-6 8-6s6 2 8 6v2h-16z" fill={hair} />
      ) : (
        <path
          d="M24 12c2-5 6-6 8-6s6 1 8 6v12c-4 2-12 2-16 0V12z"
          fill={hair}
        />
      )}

      {/* Torso — female slightly narrower */}
      {gender === "male" ? (
        <path
          d="M20 26c0 0 2-4 12-4s12 4 12 4v14c0 2.8-2.2 5-5 5H25c-2.8 0-5-2.2-5-5V26z"
          fill={jersey}
        />
      ) : (
        <path
          d="M22 26c0 0 2-4 10-4s10 4 10 4v14c0 2.8-2 5-4.5 5h-11c-2.5 0-4.5-2.2-4.5-5V26z"
          fill={jersey}
        />
      )}

      {/* Arms */}
      <path d="M12 28c3 2 6 1 8-1v10c0 1.7-1.3 3-3 3H14a4 4 0 01-2-7z" fill={jersey} />
      <path d="M52 28c-3 2-6 1-8-1v10c0 1.7 1.3 3 3 3h6a4 4 0 002-7z" fill={jersey} />

      {/* Shorts */}
      <path
        d="M23 40h18v8c0 2-1.5 3-3.5 3h-11c-2 0-3.5-1-3.5-3v-8z"
        fill="#1f2937"
      />

      {/* Legs */}
      <rect x="23" y="51" width="6" height="10" rx="2" fill="#1f2937" />
      <rect x="35" y="51" width="6" height="10" rx="2" fill="#1f2937" />
    </svg>
  );
}
