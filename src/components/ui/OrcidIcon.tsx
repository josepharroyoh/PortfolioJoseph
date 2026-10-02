/** ORCID's official mark (not in Phosphor). */
export function OrcidIcon({ size = 20, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24ZM8.06 17.6H6.62V7.46h1.44V17.6Zm-.72-11.6a.95.95 0 1 1 0-1.9.95.95 0 0 1 0 1.9Zm3.03 1.46h3.9c3.7 0 5.33 2.65 5.33 5.07 0 2.63-2.06 5.07-5.31 5.07h-3.92V7.46Zm1.44 1.3v7.54h2.3c3.26 0 4.01-2.48 4.01-3.77 0-2.1-1.34-3.77-4.09-3.77h-2.22Z" />
    </svg>
  );
}
