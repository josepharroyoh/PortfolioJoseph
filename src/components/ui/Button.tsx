import clsx from "clsx";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { Magnetic } from "./motion";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: "primary" | "ghost";
  icon?: ReactNode;
};

/** Pill link with a magnetic pull and a sliding fill on hover. */
export function ButtonLink({ variant = "primary", icon, className, children, ...rest }: Props) {
  return (
    <Magnetic strength={0.25}>
      <a
        {...rest}
        className={clsx(
          "group relative inline-flex items-center gap-3 overflow-hidden rounded-full px-6 py-3.5 text-sm font-medium tracking-wide transition-colors duration-500",
          variant === "primary"
            ? "bg-paper text-ink"
            : "border border-line-strong text-paper hover:border-transparent hover:text-ink",
          className,
        )}
      >
        <span
          aria-hidden="true"
          className={clsx(
            "absolute inset-0 -z-0 translate-y-full rounded-full transition-transform duration-500 ease-out-expo group-hover:translate-y-0",
            variant === "primary" ? "bg-gradient-to-r from-cyan to-violet" : "bg-paper",
          )}
        />
        <span className="relative z-10">{children}</span>
        {icon && <span className="relative z-10 transition-transform duration-500 ease-out-expo group-hover:translate-x-1">{icon}</span>}
      </a>
    </Magnetic>
  );
}
