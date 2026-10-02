import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import type { PointerEvent } from "react";
import { useTranslation } from "react-i18next";
import { ArrowUpRight } from "lucide-react";
import { SectionHeader } from "../ui/SectionHeader";
import { Reveal } from "../ui/motion";
import { BatTile } from "../brand/Bat";
import { PROJECTS } from "../../data/profile";
import { useCopy } from "../../hooks/useCopy";

type Item = { title: string; role: string; description: string };
type Project = (typeof PROJECTS)[number];

/** Plays only while on screen, so off-screen videos cost nothing. */
function LazyVideo({ src, poster, label }: { src: string; poster: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.25 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);
  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
      className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-105"
    />
  );
}

/** Generated covers for projects without footage. */
function ProjectArt({ kind, title }: { kind: string; title: string }) {
  if (kind === "aireica") {
    return (
      <div className="relative h-full w-full overflow-hidden bg-[#140d05]">
        {[
          { c: "#f5c26b", x: ["-10%", "30%", "-10%"], s: "70%", d: 14 },
          { c: "#f97316", x: ["40%", "0%", "40%"], s: "55%", d: 11 },
          { c: "#22d3ee", x: ["60%", "20%", "60%"], s: "40%", d: 17 },
        ].map((b, i) => (
          <motion.span
            key={i}
            className="absolute top-1/2 aspect-square -translate-y-1/2 rounded-full opacity-50 blur-3xl"
            style={{ background: b.c, width: b.s }}
            animate={{ left: b.x }}
            transition={{ duration: b.d, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:32px_32px]" />
        <p className="absolute inset-0 grid place-items-center font-display text-5xl tracking-[0.2em] text-white/90 md:text-6xl">{title}</p>
      </div>
    );
  }
  return (
    <div className="relative grid h-full w-full place-items-center overflow-hidden bg-[radial-gradient(circle_at_50%_40%,#1b1f3a,#05060a_70%)]">
      {[1, 2, 3].map((r) => (
        <motion.span
          key={r}
          className="absolute rounded-full border border-white/10"
          style={{ width: `${r * 28}%`, aspectRatio: "1" }}
          animate={{ rotate: r % 2 ? 360 : -360 }}
          transition={{ duration: 18 + r * 6, repeat: Infinity, ease: "linear" }}
        >
          <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-cyan shadow-[0_0_12px_#67e8f9]" />
        </motion.span>
      ))}
      <BatTile size={64} />
    </div>
  );
}

function ProjectCard({ project, item, index }: { project: Project; item: Item; index: number }) {
  const { t } = useTranslation();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(useTransform(rx, [-0.5, 0.5], [5, -5]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(ry, [-0.5, 0.5], [-6, 6]), { stiffness: 200, damping: 20 });

  const onMove = (e: PointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
    if (e.pointerType !== "mouse") return;
    rx.set((e.clientY - r.top) / r.height - 0.5);
    ry.set((e.clientX - r.left) / r.width - 0.5);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.article
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      className="spotlight glass group flex h-full flex-col overflow-hidden rounded-[2rem]"
    >
      <a href={project.link} target="_blank" rel="noopener noreferrer" className="flex h-full flex-col" aria-label={`${item.title} — ${t("projects.open")}`}>
        <div className="relative aspect-[16/10] overflow-hidden border-b border-line">
          {"video" in project ? <LazyVideo src={project.video} poster={project.poster} label={item.title} /> : <ProjectArt kind={project.key} title={item.title} />}
          <span className="glass absolute top-4 left-4 rounded-full px-3 py-1 font-mono text-[11px] tracking-[0.2em] text-paper">0{index + 1}</span>
          <span className="absolute top-4 right-4 grid h-11 w-11 place-items-center rounded-full bg-paper text-ink opacity-0 transition-all duration-500 ease-out-expo group-hover:rotate-45 group-hover:opacity-100 max-md:opacity-100">
            <ArrowUpRight size={18} />
          </span>
        </div>
        <div className="flex flex-1 flex-col p-7 md:p-8">
          <p className="font-mono text-[11px] tracking-[0.18em] text-cyan uppercase">{item.role}</p>
          <h3 className="mt-3 font-display text-3xl text-paper md:text-4xl">{item.title}</h3>
          <p className="mt-4 flex-1 text-sm leading-relaxed text-muted md:text-[15px]">{item.description}</p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <li key={tag} className="rounded-full border border-line-strong px-3 py-1 text-xs text-paper/80">
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </a>
    </motion.article>
  );
}

export function Projects() {
  const { t } = useTranslation();
  const items = useCopy<Item[]>("projects.items");
  return (
    <section id="projects" className="relative z-10 mx-auto max-w-7xl px-4 py-28 md:px-6 md:py-40">
      <SectionHeader eyebrow={t("projects.eyebrow")} title={t("projects.title")} intro={t("projects.intro")} />
      <div className="mt-16 grid gap-6 md:mt-20 md:grid-cols-2 md:pb-16">
        {PROJECTS.map((project, i) => (
          <Reveal key={project.key} delay={(i % 2) * 0.12} className={i % 2 === 1 ? "md:translate-y-16" : undefined}>
            <ProjectCard project={project} item={items[i]} index={i} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
