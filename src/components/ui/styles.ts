import clsx from "clsx";

/** Pill buttons: one primary (accent fill), one secondary (outline). */
export const button = (variant: "primary" | "secondary" = "primary", className?: string) =>
  clsx(
    "press inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-[15px] font-medium whitespace-nowrap",
    variant === "primary"
      ? "bg-accent text-on-accent hover:bg-[color-mix(in_srgb,var(--accent)_88%,var(--ink))]"
      : "border border-line-strong text-ink hover:border-ink",
    className,
  );

/** Page gutter and max width shared by every section. */
export const container = "mx-auto w-full max-w-[1200px] px-5 md:px-8";
