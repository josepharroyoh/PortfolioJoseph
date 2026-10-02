import { Reveal, SplitWords } from "./motion";

type Props = { eyebrow: string; title: string; intro?: string; align?: "left" | "center" };

export function SectionHeader({ eyebrow, title, intro, align = "left" }: Props) {
  const centered = align === "center";
  return (
    <header className={centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <Reveal>
        <p className={`eyebrow flex items-center gap-3 ${centered ? "justify-center" : ""}`}>
          <span className="h-px w-8 bg-gradient-to-r from-cyan to-violet" />
          {eyebrow}
        </p>
      </Reveal>
      <h2 className="mt-5 font-display text-[clamp(2.6rem,7vw,5.5rem)] leading-[0.95] tracking-[-0.02em] text-paper">
        <SplitWords text={title} />
      </h2>
      {intro && (
        <Reveal delay={0.15}>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted md:text-lg">{intro}</p>
        </Reveal>
      )}
    </header>
  );
}
