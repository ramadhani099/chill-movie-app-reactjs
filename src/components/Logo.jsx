export default function Logo({ className = "", textClass = "text-2xl" }) {
  return (
    <span className={`inline-flex items-center gap-2 font-black tracking-tight ${className}`}>
      <svg viewBox="0 0 32 28" className="h-6 w-7" fill="currentColor" aria-hidden="true">
        <path d="M1 8.2 27.6 1l1.7 5.6L2.7 13.8z" />
        <rect x="1" y="12.5" width="30" height="14.5" rx="2.5" />
      </svg>
      <span className={textClass}>CHILL</span>
    </span>
  );
}
