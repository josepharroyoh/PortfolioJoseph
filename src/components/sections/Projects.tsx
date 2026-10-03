import { motion, useScroll, useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRightIcon, ArrowUpRightIcon, BrowserIcon, LightningIcon, PlanetIcon, WindIcon } from "@phosphor-icons/react";
import clsx from "clsx";
import { FieldTrace } from "../fx/FieldTrace";
import { SectionHeading } from "../ui/SectionHeading";
import { button, container } from "../ui/styles";
import { PROJECTS, THESIS_PATH } from "../../data/profile";
import { useCopy } from "../../hooks/useCopy";
import { useMediaQuery } from "../../hooks/useMediaQuery";

type Item = { key: string; title: string; category: string; year: string; role: string; text: string };
type Featured = { status: string; title: string; text: string; tags: string[]; cta: string };
type Demo = { field: string; threshold: string; alert: string; strike: string; lead: string };

type CardData = {
  key: string;
  eyebrow: ReactNode;
  title: string;
  role?: string;
  text: string;
  tags: string[];
  action?: ReactNode;
  media: ReactNode;
  tone: string;
};

/** Plays only while visible, so off-screen videos cost nothing. */
function LazyVideo({ src, poster, label }: { src: string; poster?: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current;
    if (!video || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? video.play().catch(() => {}) : video.pause()), { threshold: 0.3 });
    io.observe(video);
    return () => io.disconnect();
  }, []);
  return <video ref={ref} src={src} poster={poster} muted loop playsInline preload="none" aria-label={label} className="h-full w-full object-cover" />;
}

/** Cover for projects without footage: a solid colour field and a large glyph. */
function Cover({ icon, title, tone }: { icon: ReactNode; title: string; tone: string }) {
  return (
    <div className={clsx("relative flex h-full w-full flex-col justify-between overflow-hidden p-6 md:p-8", tone)}>
      <span className="opacity-90">{icon}</span>
      <span className="font-display text-[clamp(2rem,5vw,3.6rem)] leading-none font-semibold tracking-[-0.04em]">{title}</span>
    </div>
  );
}

function StackCard({ data, index, total, progress, stacked }: { data: CardData; index: number; total: number; progress: MotionValue<number>; stacked: boolean }) {
  const target = 1 - (total - index) * 0.035;
  const scale = useTransform(progress, [index / total, 1], [1, target]);
  const transform = useTransform(scale, (s) => `scale(${s})`);

  const card = (
    <motion.article
      style={stacked ? { transform, top: `${index * 22}px` } : undefined}
      className="relative grid origin-top overflow-hidden rounded-3xl border border-line bg-surface shadow-card lg:h-[min(620px,76vh)] lg:grid-cols-12"
    >
      <div className="flex flex-col p-6 md:p-10 lg:col-span-5">
        <p className="flex items-center gap-2 text-sm text-muted">{data.eyebrow}</p>
        <h3 className="mt-4 text-[clamp(2rem,3.6vw,3.2rem)] leading-[1] font-semibold tracking-[-0.035em]">{data.title}</h3>
        {data.role && <p className="mt-2 text-accent">{data.role}</p>}
        <p className="mt-5 leading-relaxed text-muted md:text-[17px]">{data.text}</p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {data.tags.map((tag) => (
            <li key={tag} className="rounded-full border border-line px-3 py-1 text-sm text-muted">
              {tag}
            </li>
          ))}
        </ul>
        {data.action && <div className="mt-8 lg:mt-auto lg:pt-8">{data.action}</div>}
      </div>
      <div className={clsx("relative min-h-64 overflow-hidden border-t border-line lg:col-span-7 lg:border-t-0 lg:border-l", data.tone)}>{data.media}</div>
    </motion.article>
  );

  if (!stacked) return card;
  return <div className="sticky top-24 flex h-[calc(100dvh-6rem)] items-start pt-4">{card}</div>;
}

export function Projects() {
  const { t } = useTranslation();
  const items = useCopy<Item[]>("projects.items");
  const featured = useCopy<Featured>("projects.featured");
  const demo = useCopy<Demo>("thesis.demo");
  const stacked = useMediaQuery("(min-width: 1024px)");
  const listRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start start", "end end"] });

  const icons: Record<string, ReactNode> = {
    aireica: <WindIcon size={56} weight="duotone" />,
    cori: <PlanetIcon size={56} weight="duotone" />,
    portfolio: <BrowserIcon size={56} weight="duotone" />,
  };
  const tones: Record<string, string> = {
    aireica: "bg-[#e9a23b] text-[#1d1405]",
    cori: "bg-[#1b1f4b] text-[#e8e9ff]",
    portfolio: "bg-ink text-bg",
  };

  const cards: CardData[] = [
    {
      key: "thesis",
      eyebrow: (
        <span className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1 font-medium text-accent">
          <LightningIcon size={14} weight="fill" />
          {featured.status}
        </span>
      ),
      title: featured.title,
      text: featured.text,
      tags: featured.tags,
      action: (
        <Link to={THESIS_PATH} className={button("primary")}>
          {featured.cta}
          <ArrowRightIcon size={16} weight="bold" />
        </Link>
      ),
      media: (
        <div className="force-dark flex h-full items-center bg-bg p-6 md:p-10">
          <FieldTrace labels={demo} className="w-full" />
        </div>
      ),
      tone: "",
    },
    ...items.map((item): CardData => {
      const project = PROJECTS.find((p) => p.key === item.key);
      return {
        key: item.key,
        eyebrow: (
          <>
            <span className="font-mono">{item.year}</span>
            <span aria-hidden="true">/</span>
            {item.category}
          </>
        ),
        title: item.title,
        role: item.role,
        text: item.text,
        tags: project?.tags ?? [],
        action: project?.link ? (
          <a href={project.link} target="_blank" rel="noopener noreferrer" className={button("secondary")}>
            {t("projects.visit")}
            <ArrowUpRightIcon size={16} />
          </a>
        ) : undefined,
        media: project?.video ? (
          <LazyVideo src={project.video} poster={project.poster} label={item.title} />
        ) : (
          <Cover icon={icons[item.key]} title={item.title} tone={tones[item.key] ?? "bg-bg-2"} />
        ),
        tone: "bg-bg-2",
      };
    }),
  ];

  return (
    <section id="projects" aria-labelledby="projects-title" className="py-24 md:py-32">
      <div className={container}>
        <SectionHeading id="projects-title" title={t("projects.title")} intro={t("projects.intro")} />
        <div ref={listRef} className={clsx("mt-12", stacked ? "relative" : "space-y-6")}>
          {cards.map((card, i) => (
            <StackCard key={card.key} data={card} index={i} total={cards.length} progress={scrollYProgress} stacked={stacked} />
          ))}
        </div>
      </div>
    </section>
  );
}
