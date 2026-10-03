import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { useState } from "react";
import type { PointerEvent } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowUpRightIcon, PlusIcon } from "@phosphor-icons/react";
import clsx from "clsx";
import { FieldTrace } from "../fx/FieldTrace";
import { button, container } from "../ui/styles";
import { PROJECTS } from "../../data/profile";
import { useCopy } from "../../hooks/useCopy";
import { useMediaQuery } from "../../hooks/useMediaQuery";

type Item = { key: string; title: string; category: string; year: string; role: string; text: string };
type Demo = { field: string; threshold: string; alert: string; strike: string; lead: string };

const meta = (key: string) => PROJECTS.find((p) => p.key === key)!;

/** Typographic stand-in for projects without footage. */
function Cover({ item, className }: { item: Item; className?: string }) {
  return (
    <div className={clsx("relative flex flex-col justify-between overflow-hidden bg-bg-2 p-5", className)}>
      <span className="text-sm text-muted">{item.category}</span>
      <span className="font-display text-[clamp(1.6rem,3vw,2.4rem)] leading-none font-semibold tracking-[-0.04em]">{item.title}</span>
      <span aria-hidden="true" className="absolute top-5 right-5 h-3 w-3 rounded-full bg-accent" />
    </div>
  );
}

function Media({ item, open }: { item: Item; open: boolean }) {
  const demo = useCopy<Demo>("thesis.demo");
  const p = meta(item.key);
  if (item.key === "thesis") {
    return (
      <div className="rounded-xl border border-line bg-surface p-3">
        {/* Mounted on open so the chart draws itself while you watch. */}
        {open ? <FieldTrace labels={demo} compact /> : <div className="aspect-[64/26]" />}
      </div>
    );
  }
  if (p.video) {
    return open ? (
      <video src={p.video} poster={p.poster} autoPlay muted loop playsInline className="aspect-video w-full rounded-xl bg-bg-2 object-cover" />
    ) : (
      <img src={p.poster} alt="" className="aspect-video w-full rounded-xl object-cover" />
    );
  }
  return <Cover item={item} className="aspect-video rounded-xl" />;
}

function Row({ item, open, onToggle, onHover }: { item: Item; open: boolean; onToggle: () => void; onHover: (key: string | null) => void }) {
  const { t } = useTranslation();
  const p = meta(item.key);
  const panelId = `project-${item.key}`;

  return (
    <li className="border-b border-line">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          onPointerEnter={() => onHover(item.key)}
          onPointerLeave={() => onHover(null)}
          className="group grid w-full grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 py-6 text-left md:grid-cols-[5.5rem_1fr_13rem_auto] md:py-7"
        >
          <span className="order-2 col-span-2 font-mono text-sm text-muted md:order-none md:col-span-1">
            {item.year} <span className="md:hidden">· {item.category}</span>
          </span>
          <span
            className={clsx(
              "font-display text-[clamp(1.7rem,4vw,3.2rem)] leading-[1.02] font-semibold tracking-[-0.04em] transition-[color,transform] duration-300 ease-out",
              open ? "text-accent" : "group-hover:translate-x-2",
            )}
          >
            {item.title}
          </span>
          <span className="hidden text-[15px] text-muted md:block">{item.category}</span>
          <span
            aria-hidden="true"
            className={clsx(
              "row-span-2 grid h-10 w-10 place-items-center rounded-full border transition-[transform,background-color,border-color,color] duration-300 ease-out md:row-span-1",
              open ? "rotate-45 border-accent bg-accent text-on-accent" : "border-line-strong group-hover:border-ink",
            )}
          >
            <PlusIcon size={16} weight="bold" />
          </span>
        </button>
      </h3>

      <div id={panelId} role="region" aria-label={item.title} className={clsx("grid transition-[grid-template-rows] duration-300 ease-out", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
        <div className="min-h-0 overflow-hidden" inert={!open}>
          <div className={clsx("grid gap-8 pb-10 transition-opacity duration-300 md:grid-cols-12 md:pl-[5.5rem]", open ? "opacity-100" : "opacity-0")}>
            <div className="md:col-span-7">
              <Media item={item} open={open} />
            </div>
            <div className="flex flex-col md:col-span-5">
              <p className="text-sm text-muted">{item.role}</p>
              <p className="mt-3 leading-relaxed">{item.text}</p>
              <ul className="mt-5 flex flex-wrap gap-1.5">
                {p.tags.map((tag) => (
                  <li key={tag} className="rounded-full border border-line px-2.5 py-1 text-[13px] text-muted">
                    {tag}
                  </li>
                ))}
              </ul>
              <div className="mt-6 md:mt-auto md:pt-6">
                {p.page ? (
                  <Link to={p.page} className={button("primary", "h-10 px-4 text-sm")}>
                    {t("projects.page")}
                    <ArrowUpRightIcon size={15} />
                  </Link>
                ) : p.link ? (
                  <a href={p.link} target="_blank" rel="noopener noreferrer" className={button("secondary", "h-10 px-4 text-sm")}>
                    {t("projects.visit")}
                    <ArrowUpRightIcon size={15} />
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

export function Projects() {
  const { t } = useTranslation();
  const items = useCopy<Item[]>("projects.items");
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const canPreview = useMediaQuery("(hover: hover) and (pointer: fine) and (min-width: 1024px)");

  // The preview trails the cursor on a spring so it feels attached but not glued.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 420, damping: 38, mass: 0.6 });
  const y = useSpring(my, { stiffness: 420, damping: 38, mass: 0.6 });
  const onMove = (e: PointerEvent<HTMLElement>) => {
    mx.set(e.clientX + 24);
    my.set(e.clientY - 90);
  };

  const preview = canPreview && hovered && hovered !== openKey ? items.find((i) => i.key === hovered) : undefined;

  return (
    <section id="projects" aria-labelledby="projects-title" className="border-t border-line py-20 md:py-28">
      <div className={container}>
        <div className="grid gap-4 lg:grid-cols-12 lg:items-end lg:gap-12">
          <h2 id="projects-title" className="reveal text-[clamp(2.8rem,7vw,6rem)] leading-[0.95] font-semibold tracking-[-0.05em] lg:col-span-7">
            {t("projects.title")}
          </h2>
          <p className="reveal max-w-[44ch] leading-relaxed text-muted lg:col-span-5 lg:pb-2">{t("projects.intro")}</p>
        </div>

        <ul className="mt-10 border-t border-line-strong" onPointerMove={canPreview ? onMove : undefined}>
          {items.map((item) => (
            <Row
              key={item.key}
              item={item}
              open={openKey === item.key}
              onToggle={() => setOpenKey((k) => (k === item.key ? null : item.key))}
              onHover={setHovered}
            />
          ))}
        </ul>
      </div>

      <motion.div aria-hidden="true" style={{ x, y }} className="pointer-events-none fixed top-0 left-0 z-40">
        <AnimatePresence>
          {preview && (
            <motion.div
              key={preview.key}
              initial={{ opacity: 0, transform: "scale(0.92)" }}
              animate={{ opacity: 1, transform: "scale(1)" }}
              exit={{ opacity: 0, transform: "scale(0.96)", transition: { duration: 0.12 } }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="absolute w-[300px] origin-top-left overflow-hidden rounded-xl border border-line shadow-card"
            >
              {meta(preview.key).poster ? (
                <img src={meta(preview.key).poster} alt="" className="aspect-video w-full object-cover" />
              ) : (
                <Cover item={preview} className="aspect-video" />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
