import clsx from "clsx";
import type { CSSProperties, ReactNode } from "react";

/** Infinite horizontal loop; content is rendered twice for a seamless wrap. */
export function Marquee({ children, reverse = false, duration = 40, className }: { children: ReactNode; reverse?: boolean; duration?: number; className?: string }) {
  return (
    <div className={clsx("group mask-fade-x flex overflow-hidden", className)}>
      <div
        className={clsx(
          "flex w-max shrink-0 group-hover:[animation-play-state:paused]",
          reverse ? "animate-marquee-reverse" : "animate-marquee",
        )}
        style={{ "--marquee-duration": `${duration}s` } as CSSProperties}
      >
        <div className="flex shrink-0 items-center gap-4 pr-4">{children}</div>
        <div className="flex shrink-0 items-center gap-4 pr-4" aria-hidden="true">{children}</div>
      </div>
    </div>
  );
}
