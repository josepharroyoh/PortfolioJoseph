import clsx from "clsx";

type Props = { title: string; intro?: string; className?: string; id?: string };

export function SectionHeading({ title, intro, className, id }: Props) {
  return (
    <header className={clsx("reveal max-w-2xl", className)}>
      <h2 id={id} className="text-[clamp(2.1rem,4.6vw,3.6rem)] leading-[1.02] font-semibold tracking-[-0.03em]">
        {title}
      </h2>
      {intro && <p className="mt-4 max-w-[60ch] text-lg leading-relaxed text-muted">{intro}</p>}
    </header>
  );
}
