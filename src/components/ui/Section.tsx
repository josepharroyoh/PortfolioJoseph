import type { ReactNode } from "react";
import clsx from "clsx";
import { container } from "./styles";

type Props = {
  id: string;
  title: string;
  intro?: string;
  /** Extra content under the heading, kept in the sticky column on desktop. */
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
};

/** Index layout: the heading stays pinned on the left while the content scrolls past. */
export function Section({ id, title, intro, aside, children, className }: Props) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={clsx("border-t border-line py-20 md:py-28", className)}>
      <div className={clsx(container, "grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12")}>
        <header className="min-w-0 lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <h2 id={`${id}-title`} className="reveal text-[clamp(2.3rem,4.4vw,3.5rem)] leading-[1] font-semibold tracking-[-0.04em]">
              {title}
            </h2>
            {intro && <p className="reveal mt-4 max-w-[36ch] leading-relaxed text-muted">{intro}</p>}
            {aside}
          </div>
        </header>
        <div className="min-w-0 lg:col-span-8">{children}</div>
      </div>
    </section>
  );
}
