export default function Logo({ size = 28, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="swiftpay-logo-grad" x1="4" y1="4" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7C5CFC" />
          <stop offset="55%" stopColor="#4FA8FF" />
          <stop offset="100%" stopColor="#33F2A0" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="12" fill="url(#swiftpay-logo-grad)" />
      {/* two overlapping arcs reading as motion / a coin turning into a swift arrow */}
      <path
        d="M11 26.5C11 20.7 15.7 16 21.5 16H29"
        stroke="#07070C"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <path d="M24 11.5L29 16L24 20.5" stroke="#07070C" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M29 13.5C29 19.3 24.3 24 18.5 24H11"
        stroke="#07070C"
        strokeWidth="3.4"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path d="M16 28.5L11 24L16 19.5" stroke="#07070C" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.55" />
    </svg>
  );
}
