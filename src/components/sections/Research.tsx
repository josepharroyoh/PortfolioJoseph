import { motion } from "framer-motion";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ArrowUpRight, BookOpen, FlaskConical, Rocket } from "lucide-react";
import { SectionHeader } from "../ui/SectionHeader";
import { Reveal } from "../ui/motion";
import { PROFILE } from "../../data/profile";
import { useCopy } from "../../hooks/useCopy";
import { useSpotlight } from "../../hooks/useSpotlight";

type Featured = { title: string; journal: string; year: string; authors: string };
type Project = { badge: string; title: string; authors: string; description: string; link?: keyof typeof PROFILE.links };
type Congress = { title: string; meta: string; topic: string };

const ME = /(Arroyo,? J\.|Joseph P\. Arroyo)/;

/** Authors list with Joseph's name emphasised. */
function Authors({ text }: { text: string }) {
  return (
    <>
      {text.split(ME).map((part, i) =>
        ME.test(part) ? (
          <strong key={i} className="font-medium text-paper underline decoration-cyan/60 decoration-1 underline-offset-4">
            {part}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

/** A noisy "potential gradient" trace that draws itself in. */
function Signal() {
  const d = useMemo(() => {
    let path = "M0 60";
    for (let x = 4; x <= 600; x += 4) {
      const y = 60 + Math.sin(x / 38) * 18 + Math.sin(x / 9) * 6 + Math.sin(x / 3.1) * 2.5 + (x > 330 && x < 380 ? -26 * Math.sin(((x - 330) / 50) * Math.PI) : 0);
      path += ` L${x} ${y.toFixed(1)}`;
    }
    return path;
  }, []);
  return (
    <svg viewBox="0 0 600 120" className="h-24 w-full" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="sig" x1="0" x2="1">
          <stop offset="0" stopColor="#67e8f9" stopOpacity="0" />
          <stop offset="0.3" stopColor="#67e8f9" />
          <stop offset="1" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
      {[30, 60, 90].map((y) => (
        <line key={y} x1="0" x2="600" y1={y} y2={y} stroke="rgba(255,255,255,0.06)" strokeDasharray="2 6" />
      ))}
      <motion.path
        d={d}
        fill="none"
        stroke="url(#sig)"
        strokeWidth="1.6"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2.4, ease: [0.65, 0, 0.35, 1] }}
      />
    </svg>
  );
}

export function Research() {
  const { t } = useTranslation();
  const featured = useCopy<Featured>("research.featured");
  const projects = useCopy<Project[]>("research.projects");
  const congresses = useCopy<Congress[]>("research.congresses");
  const spotlight = useSpotlight<HTMLDivElement>();

  return (
    <section id="research" className="relative z-10 mx-auto max-w-7xl px-4 py-28 md:px-6 md:py-40">
      <SectionHeader eyebrow={t("research.eyebrow")} title={t("research.title")} intro={t("research.intro")} />

      <Reveal className="mt-16 md:mt-20">
        <article {...spotlight} className="spotlight glass overflow-hidden rounded-[2rem]">
          <div className="grid gap-10 p-7 md:grid-cols-12 md:p-12">
            <div className="flex flex-col justify-between gap-8 md:col-span-4">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-cyan/10 px-3 py-1.5 text-xs text-cyan ring-1 ring-cyan/30">
                  <BookOpen size={14} />
                  {t("research.featuredBadge")}
                </span>
                <p className="mt-6 font-mono text-xs leading-relaxed tracking-[0.12em] text-muted uppercase">{featured.journal}</p>
              </div>
              <p className="font-display text-[clamp(4.5rem,10vw,8rem)] leading-none text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.35)]">
                {featured.year}
              </p>
            </div>
            <div className="md:col-span-8">
              <h3 className="font-display text-[clamp(1.8rem,3.4vw,2.9rem)] leading-[1.1] text-paper">{featured.title}</h3>
              <p className="mt-6 text-xs tracking-[0.18em] text-faint uppercase">{t("research.authorsLabel")}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                <Authors text={featured.authors} />
              </p>
              <div className="mt-8">
                <Signal />
              </div>
            </div>
          </div>
        </article>
      </Reveal>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {projects.map((p, i) => {
          const Icon = i === 0 ? FlaskConical : Rocket;
          const href = p.link ? PROFILE.links[p.link] : undefined;
          return (
            <Reveal key={p.title} delay={i * 0.1}>
              <article {...spotlight} className="spotlight glass flex h-full flex-col rounded-[2rem] p-7 md:p-9">
                <div className="flex items-center justify-between gap-4">
                  <span className="inline-flex items-center gap-2 rounded-full border border-line-strong px-3 py-1.5 text-xs text-paper/90">
                    <Icon size={14} className="text-violet" />
                    {p.badge}
                  </span>
                  {href && (
                    <a href={href} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-1 text-sm text-cyan">
                      {t("research.visit")}
                      <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  )}
                </div>
                <h3 className="mt-7 font-display text-2xl leading-snug text-paper md:text-3xl">{p.title}</h3>
                <p className="mt-3 text-sm text-muted">
                  <Authors text={p.authors} />
                </p>
                <p className="mt-5 text-sm leading-relaxed text-muted md:text-[15px]">{p.description}</p>
              </article>
            </Reveal>
          );
        })}
      </div>

      <div className="mt-24">
        <Reveal>
          <h3 className="eyebrow">{t("research.congressesTitle")}</h3>
        </Reveal>
        <ol className="mt-6 border-t border-line">
          {congresses.map((c, i) => (
            <Reveal as="li" key={`${c.title}-${i}`} delay={i * 0.08} className="group border-b border-line">
              <div className="grid gap-3 py-8 transition-[padding] duration-500 md:grid-cols-12 md:gap-8 md:group-hover:pl-4">
                <span className="font-mono text-sm text-faint md:col-span-1">0{i + 1}</span>
                <div className="md:col-span-5">
                  <p className="text-lg leading-snug text-paper transition-colors group-hover:text-cyan">{c.title}</p>
                  <p className="mt-2 font-mono text-[11px] tracking-[0.15em] text-faint uppercase">{c.meta}</p>
                </div>
                <p className="text-sm leading-relaxed text-muted md:col-span-6">{c.topic}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
