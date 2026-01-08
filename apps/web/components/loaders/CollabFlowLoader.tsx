"use client";

export function CollabFlowLoader({ size = 64 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      className="collabflow-spin">
      {/* Rotate whole icon */}
      <animateTransform
        attributeName="transform"
        type="rotate"
        from="0 32 32"
        to="360 32 32"
        dur="6s"
        repeatCount="indefinite"
      />

      {/* Background */}
      <rect width="64" height="64" rx="14" fill="#0F172A" />

      {/* Nodes */}
      <circle cx="20" cy="32" r="6" fill="#38BDF8">
        <animate
          attributeName="r"
          values="5;7;5"
          dur="1.2s"
          repeatCount="indefinite"
        />
      </circle>

      <circle cx="44" cy="20" r="6" fill="#A855F7">
        <animate
          attributeName="r"
          values="5;7;5"
          dur="1.2s"
          begin="0.2s"
          repeatCount="indefinite"
        />
      </circle>

      <circle cx="44" cy="44" r="6" fill="#22C55E">
        <animate
          attributeName="r"
          values="5;7;5"
          dur="1.2s"
          begin="0.4s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Flow lines */}
      <path
        d="M25 32 L38 22"
        stroke="#CBD5F5"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M25 32 L38 42"
        stroke="#CBD5F5"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
