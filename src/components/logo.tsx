import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <title>Syndicate ESP Dragon Logo</title>
      {/* Head and neck - white */}
      <path d="M6 15s-2-2-2-5 2-4 4-4 4.5 1 5 2" stroke="white" />

      {/* Horns/Crest - red */}
      <path
        d="M13 3l2 4l-2 4"
        stroke="hsl(var(--primary))"
        strokeWidth="2"
      />
      <path d="M5.5 5S4 8 6 10" stroke="hsl(var(--primary))" />

      {/* Body/Tail - blue */}
      <path
        d="M19 12c-3 0-4-1-4-1s-1-1-3-1-3 1-3 1-1 1-2.5 1"
        stroke="hsl(var(--accent))"
      />
      <path d="M10 18c-5 0-6-4-6-4" stroke="hsl(var(--accent))" />
      <path
        d="M21 21c-3-3-4-6-4-6"
        stroke="hsl(var(--accent))"
        strokeWidth="2"
      />

      {/* Eye - red */}
      <circle
        cx="9"
        cy="8"
        r="0.5"
        fill="hsl(var(--primary))"
        stroke="hsl(var(--primary))"
      />
    </svg>
  );
}
