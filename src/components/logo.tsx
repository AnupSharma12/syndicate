import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      {...props}
    >
      <title>Syndicate ESP Logo</title>
      <path
        d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm0 192a88 88 0 1 1 88-88a88.1 88.1 0 0 1-88 88Z"
        fill="currentColor"
      />
      <path
        d="m163.51 92.49l-48 48a12 12 0 0 1-17 0l-16-16a12 12 0 0 1 17-17l7.51 7.52l39.5-39.5a12 12 0 0 1 17 17Z"
        fill="currentColor"
      />
    </svg>
  );
}
