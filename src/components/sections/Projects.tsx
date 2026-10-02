import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { useState } from "react";
import type { PointerEvent } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRightIcon, ArrowUpRightIcon, LightningIcon } from "@phosphor-icons/react";
import clsx from "clsx";
import { FieldTrace } from "../fx/FieldTrace";
import { SectionHeading } from "../ui/SectionHeading";
import { button, container } from "../ui/styles";
import { PROJECTS, THESIS_PATH } from "../../data/profile";
import { useCopy } from "../../hooks/useCopy";
import { useMediaQuery } from "../../hooks/useMediaQuery";

type Item = { key: string; title: string; category: string; year: string; text: string };
type Featured = { status: string; title: string; text: string; tags: string[]; cta: string };
type Demo = { field: string; threshold: string; alert: string; strike: string; lead: string };

function FeaturedThesis() {
  const f = useCopy<Featured>("projects.featured");
  const demo = useCopy<Demo>("thesis.demo");
  return (
    <article className="reveal mt-14 grid gap-10 rounded-2xl border border-line bg-surface p-6 shadow-card md:p-10 lg:grid-cols-12 lg:items-center">
      <div className="lg:col-span-6">
        <p className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1 text-sm font-medium text-accent">
          <LightningIcon size={15} weight="fill" />
          {f.status}
        </p>
        <h3 className="mt-5 text-[clamp(2rem,4vw,3.2rem)] leading-[1.02] font-semibold tracking-[-0.03em]">
          <Link to={THESIS_PATH} className="hover:text-accent">
            {f.title}
          </Link>
        </h3>
        <p className="mt-4 max-w-[46ch] text-lg leading-relaxed text-muted">{f.text}</p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {f.tags.map((tag) => (
            <li key={tag} className="rounded-full border border-line px-3 py-1 text-sm text-muted">
              {tag}
            </li>
          ))}
        </ul>
        <Link to={THESIS_PATH} className={button("primary", "mt-8")}>
          {f.cta}
          <ArrowRightIcon size={16} weight="bold" />
        </Link>
      </div>
      <Link to={THESIS_PATH} tabIndex={-1} aria-hidden="true" className="block rounded-xl bg-bg p-4 md:p-6 lg:col-span-6">
        <FieldTrace labels={demo} />
      </Link>
    </article>
  );
}

/** Image that trails the cursor over the project list (decorative, desktop only). */
function HoverPreview({ project, title, x, y }: { project?: (typeof PROJECTS)[number]; title: string; x: ReturnType<typeof useSpring>; y: ReturnType<typeof useSpring> }) {
  return (
    <motion.div style={{ x, y }} className="pointer-events-none fixed top-0 left-0 z-40">
      <AnimatePresence mode="popLayout">
        {project && (
          <motion.div
            key={project.key}
            initial={{ opacity: 0, transform: "translate(-50%, -50%) scale(0.92)" }}
            animate={{ opacity: 1, transform: "translate(-50%, -50%) scale(1)" }}
            exit={{ opacity: 0, transform: "translate(-50%, -50%) scale(0.96)", transition: { duration: 0.12 } }}
            transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
            className="w-72 overflow-hidden rounded-xl border border-line bg-surface shadow-card"
          >
            {project.video ? (
              <video src={project.video} poster={project.poster} autoPlay muted loop playsInline className="aspect-[16/10] w-full object-cover" />
            ) : (
              <div className="flex aspect-[16/10] w-full items-end bg-accent p-4">
                <span className="text-2xl leading-none font-semibold tracking-[-0.02em] text-on-accent">{title}</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function Projects() {
  const { t } = useTranslation();
  const items = useCopy<Item[]>("projects.items");
  const hoverCapable = useMediaQuery("(hover: hover) and (pointer: fine)");
  const [hovered, setHovered] = useState<string | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 260, damping: 28, mass: 0.6 });
  const y = useSpring(my, { stiffness: 260, damping: 28, mass: 0.6 });

  const onMove = (e: PointerEvent) => {
    mx.set(Math.min(e.clientX + 170, window.innerWidth - 160));
    my.set(e.clientY);
  };

  const hoveredProject = PROJECTS.find((p) => p.key === hovered);
  const hoveredTitle = items.find((i) => i.key === hovered)?.title ?? "";

  return (
    <section id="projects" aria-labelledby="projects-title" className="py-24 md:py-36">
      <div className={container}>
        <SectionHeading id="projects-title" title={t("projects.title")} intro={t("projects.intro")} />
        <FeaturedThesis />

        <ul className="mt-16 border-t border-line" onPointerMove={hoverCapable ? onMove : undefined} onPointerLeave={() => setHovered(null)}>
          {items.map((item) => {
            const project = PROJECTS.find((p) => p.key === item.key);
            const href = project?.link;
            const Row = href ? "a" : "div";
            return (
              <li key={item.key} className="reveal border-b border-line">
                <Row
                  {...(href ? { href, target: "_blank", rel: "noopener noreferrer" } : {})}
                  onPointerEnter={hoverCapable ? () => setHovered(item.key) : undefined}
                  className={clsx(
                    "group grid gap-3 py-7 md:grid-cols-12 md:items-baseline md:gap-6 md:py-9",
                    href && "cursor-pointer",
                  )}
                >
                  <span className="font-mono text-sm text-faint md:col-span-1">{item.year}</span>
                  <span className="md:col-span-4">
                    <span className="flex items-center gap-2 text-[clamp(1.6rem,3vw,2.4rem)] leading-tight font-semibold tracking-[-0.025em] transition-colors duration-200 group-hover:text-accent">
                      {item.title}
                      {href && (
                        <ArrowUpRightIcon
                          size={22}
                          className="shrink-0 text-faint transition-[transform,color] duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
                        />
                      )}
                    </span>
                    <span className="mt-1 block text-sm text-muted">{item.category}</span>
                  </span>
                  <span className="text-[15px] leading-relaxed text-muted md:col-span-5">{item.text}</span>
                  <span className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-faint md:col-span-2 md:justify-end md:text-right">
                    {project?.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}
                  </span>
                  {!hoverCapable && project?.poster && (
                    <img src={project.poster} alt="" loading="lazy" className="mt-2 aspect-[16/9] w-full rounded-xl border border-line object-cover md:col-span-12" />
                  )}
                </Row>
              </li>
            );
          })}
        </ul>
      </div>
      {hoverCapable && <HoverPreview project={hoveredProject} title={hoveredTitle} x={x} y={y} />}
    </section>
  );
}
