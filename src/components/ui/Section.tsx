import type { ReactNode } from "react";
import clsx from "clsx";
import { Words } from "../fx/Interactions";

type Props = {
  id: string;
  title: string;
  intro?: string;
  /** Margin notes: a narrow column on the right on desktop, after the content on phones. */
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
};

/** A chapter of the page, laid out like a journal article: text column plus margin notes. */
export function Section({ id, title, intro, aside, children, className }: Props) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={clsx("py-16 md:py-24", className)}>
      <div aria-hidden="true" className="rule-draw h-px bg-[linear-gradient(90deg,var(--accent),var(--line-strong)_45%)]" />
      <h2 id={`${id}-title`} className="mt-10 text-[clamp(2.2rem,4vw,3.4rem)] leading-[1.02] tracking-[-0.025em]">
        <Words text={title} />
      </h2>
      {intro && <p className="reveal mt-3 max-w-[58ch] text-muted">{intro}</p>}
      <div className={clsx("mt-10", aside && "grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_14rem] lg:gap-12")}>
        <div className="min-w-0">{children}</div>
        {aside && <aside className="min-w-0 text-[0.9375rem] lg:border-l lg:border-line lg:pl-6">{aside}</aside>}
      </div>
    </section>
  );
}
