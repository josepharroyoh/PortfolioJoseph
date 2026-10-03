import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowUpRightIcon } from "@phosphor-icons/react";
import clsx from "clsx";
import { FieldTrace } from "../fx/FieldTrace";
import { Tilt, Words } from "../fx/Interactions";
import { Section } from "../ui/Section";
import { button } from "../ui/styles";
import { PROJECTS } from "../../data/profile";
import { useCopy } from "../../hooks/useCopy";

type Item = { key: string; title: string; category: string; year: string; role: string; text: string };
type Demo = { field: string; threshold: string; alert: string; strike: string; lead: string };

const meta = (key: string) => PROJECTS.find((p) => p.key === key)!;

/** Plays muted while on screen, pauses when it leaves (and never under reduced motion). */
function InViewVideo({ src, poster }: { src: string; poster?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? el.play().catch(() => {}) : el.pause()), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <video ref={ref} src={src} poster={poster} muted loop playsInline preload="none" className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]" />;
}

/** Typographic plate for projects without footage. */
function Plate({ item }: { item: Item }) {
  return (
    <div className="flex h-full flex-col justify-between bg-bg-2 p-6 md:p-8">
      <span className="label">{item.category}</span>
      <span className="font-serif text-[clamp(2rem,4vw,3.4rem)] leading-[0.95] tracking-[-0.03em] italic">{item.title}</span>
      <span className="text-sm text-muted">{item.role}</span>
    </div>
  );
}

function Media({ item }: { item: Item }) {
  const demo = useCopy<Demo>("thesis.demo");
  const p = meta(item.key);
  if (item.key === "thesis") {
    return (
      <div className="flex h-full items-center bg-surface p-4 md:p-6">
        <FieldTrace labels={demo} compact className="w-full" />
      </div>
    );
  }
  if (p.video) return <InViewVideo src={p.video} poster={p.poster} />;
  if (p.poster) return <img src={p.poster} alt="" loading="lazy" className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.02]" />;
  return <Plate item={item} />;
}

function ProjectFigure({ item, index }: { item: Item; index: number }) {
  const { t } = useTranslation();
  const p = meta(item.key);
  const flip = index % 2 === 1;

  return (
    <article className="grid items-center gap-6 md:grid-cols-12 md:gap-10">
      <figure className={clsx("md:col-span-7", flip && "md:order-2")}>
        <div className="reveal-clip">
          <Tilt className="group overflow-hidden rounded-sm border border-line-strong shadow-[0_0_0_0_transparent] transition-shadow duration-300 hover:shadow-card">
            {p.page ? (
              <Link to={p.page} data-cursor={t("projects.cursor")} aria-label={item.title} className="block aspect-[16/10]">
                <Media item={item} />
              </Link>
            ) : p.link ? (
              <a href={p.link} target="_blank" rel="noopener noreferrer" data-cursor={t("projects.cursor")} aria-label={item.title} className="block aspect-[16/10]">
                <Media item={item} />
              </a>
            ) : (
              <div className="aspect-[16/10]">
                <Media item={item} />
              </div>
            )}
          </Tilt>
        </div>
        <figcaption className="mt-2 text-sm text-muted">
          <span className="font-semibold text-ink">
            {t("projects.figure")} {index + 2}.
          </span>{" "}
          <span className="font-serif italic">{item.title}</span>, {item.year}. {item.category}.
        </figcaption>
      </figure>

      <div className={clsx("reveal md:col-span-5", flip && "md:order-1")}>
        <p className="label">
          {item.category} · <span className="tabular-nums">{item.year}</span>
        </p>
        <h3 className="mt-3 font-serif text-[clamp(1.9rem,3.2vw,2.7rem)] leading-[1.02] tracking-[-0.025em]">
          <Words text={item.title} />
        </h3>
        <p className="mt-2 text-sm text-muted italic">{item.role}</p>
        <p className="serif-body mt-4 text-[1.1rem]">{item.text}</p>
        <ul className="mt-5 flex flex-wrap gap-1.5">
          {p.tags.map((tag) => (
            <li key={tag} className="rounded-full border border-line px-2.5 py-0.5 text-[0.8125rem] text-muted">
              {tag}
            </li>
          ))}
        </ul>
        {(p.page || p.link) && (
          <div className="mt-6">
            {p.page ? (
              <Link to={p.page} className={button("primary", "h-10 px-4 text-sm")}>
                {t("projects.page")}
                <ArrowUpRightIcon size={15} />
              </Link>
            ) : (
              <a href={p.link} target="_blank" rel="noopener noreferrer" className="link-underline inline-flex items-center gap-1 text-accent">
                {t("projects.visit")}
                <ArrowUpRightIcon size={15} />
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export function Projects() {
  const { t } = useTranslation();
  const items = useCopy<Item[]>("projects.items");

  return (
    <Section id="projects" title={t("projects.title")} intro={t("projects.intro")}>
      <div className="space-y-20 md:space-y-28">
        {items.map((item, i) => (
          <ProjectFigure key={item.key} item={item} index={i} />
        ))}
      </div>
    </Section>
  );
}
