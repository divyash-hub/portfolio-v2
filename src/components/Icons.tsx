const base = {
  width: 16,
  height: 16,
  viewBox: "0 0 16 16",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

/** Points right: an internal link. */
export const ArrowRight = () => (
  <svg {...base}>
    <path d="M3 8h10M9 4l4 4-4 4" />
  </svg>
);

/** Points up and out: leaves this site. */
export const ArrowOut = () => (
  <svg {...base}>
    <path d="M5 11 11 5M6 5h5v5" />
  </svg>
);

export const ArrowLeft = () => (
  <svg {...base}>
    <path d="M13 8H3M7 4 3 8l4 4" />
  </svg>
);
