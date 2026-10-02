import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowDownRight, ArrowRight } from "lucide-react";
import { ButtonLink } from "../ui/Button";
import { CountUp, Reveal } from "../ui/motion";
import { GithubIcon, LinkedinIcon, OrcidIcon } from "../ui/icons";
import { PROFILE } from "../../data/profile";
import { useCopy } from "../../hooks/useCopy";
import { useScrollTo } from "../../hooks/useScrollTo";

const EASE = [0.16, 1, 0.3, 1] as const;

type Stat = { value: number; prefix: string; suffix: string; label: string };

function LocalTime() {
  const { t, i18n } = useTranslation();
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const time = now.toLocaleTimeString(i18n.resolvedLanguage, { timeZone: PROFILE.timeZone, hour: "2-digit", minute: "2-digit", second: "2-digit" });
  return (
    <p className="font-mono text-[11px] tracking-[0.2em] text-muted uppercase">
      {t("hero.localTime")} <span className="ml-2 text-paper tabular-nums">{time}</span>
    </p>
  );
}

function RotatingRole({ roles }: { roles: string[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setI((n) => (n + 1) % roles.length), 2600);
    return () => window.clearInterval(id);
  }, [roles.length]);
  return (
    <span className="relative inline-grid overflow-hidden align-bottom">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={roles[i % roles.length]}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="text-gradient animate-shimmer col-start-1 row-start-1 italic"
        >
          {roles[i % roles.length]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function Hero({ ready }: { ready: boolean }) {
  const { t } = useTranslation();
  const roles = useCopy<string[]>("hero.roles");
  const stats = useCopy<Stat[]>("stats");
  const scrollTo = useScrollTo();
  const show = ready ? "show" : "hide";

  const line = {
    hide: { y: "110%" },
    show: (i: number) => ({ y: "0%", transition: { duration: 1.2, delay: 0.1 + i * 0.12, ease: EASE } }),
  };
  const fade = {
    hide: { opacity: 0, y: 24 },
    show: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 1, delay: 0.5 + i * 0.1, ease: EASE } }),
  };

  return (
    <section id="home" className="relative z-10">
      <div className="mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-between px-4 pt-32 pb-24 md:px-6 md:pt-36 md:pb-28">
        <div>
          <motion.p custom={0} variants={fade} initial="hide" animate={show} className="eyebrow flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan" />
            </span>
            {t("hero.eyebrow")}
          </motion.p>

          <h1 className="mt-6 font-display text-[clamp(3.4rem,10vw,8rem)] leading-[0.88] tracking-[-0.035em]">
            <span className="block overflow-hidden pb-[0.06em]">
              <motion.span custom={0} variants={line} initial="hide" animate={show} className="block">
                {t("hero.firstName")}
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.08em]">
              <motion.span custom={1} variants={line} initial="hide" animate={show} className="block italic text-paper/90">
                {t("hero.lastName")}
              </motion.span>
            </span>
          </h1>

          <motion.p custom={1} variants={fade} initial="hide" animate={show} className="mt-8 font-display text-[clamp(1.6rem,3.6vw,2.6rem)] leading-tight text-muted">
            {t("hero.rolePrefix")} <RotatingRole roles={roles} />
          </motion.p>

          <motion.p custom={2} variants={fade} initial="hide" animate={show} className="mt-6 max-w-xl text-base leading-relaxed text-muted md:text-lg">
            {t("hero.tagline")}
          </motion.p>

          <motion.div custom={3} variants={fade} initial="hide" animate={show} className="mt-10 flex flex-wrap items-center gap-3">
            <ButtonLink href="#research" onClick={(e) => { e.preventDefault(); scrollTo("research"); }} icon={<ArrowRight size={16} />}>
              {t("hero.ctaPrimary")}
            </ButtonLink>
            <ButtonLink href="#contact" variant="ghost" onClick={(e) => { e.preventDefault(); scrollTo("contact"); }}>
              {t("hero.ctaSecondary")}
            </ButtonLink>
          </motion.div>
        </div>

        <motion.div custom={5} variants={fade} initial="hide" animate={show} className="mt-12 flex flex-col-reverse gap-6 sm:flex-row sm:items-end sm:justify-between">
          <LocalTime />
          <button type="button" onClick={() => scrollTo("about")} className="group hidden items-center gap-3 sm:flex">
            <span className="relative h-12 w-px overflow-hidden bg-line">
              <motion.span
                className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-transparent to-cyan"
                animate={{ y: ["-100%", "200%"] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              />
            </span>
            <span className="font-mono text-[11px] tracking-[0.25em] text-muted uppercase transition-colors group-hover:text-paper">{t("hero.scroll")}</span>
          </button>
          <div className="flex items-center gap-5 text-muted">
            <a href={PROFILE.links.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="transition-colors hover:text-paper"><GithubIcon className="h-5 w-5" /></a>
            <a href={PROFILE.links.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="transition-colors hover:text-paper"><LinkedinIcon className="h-5 w-5" /></a>
            <a href={PROFILE.links.orcid} target="_blank" rel="noopener noreferrer" aria-label="ORCID" className="transition-colors hover:text-paper"><OrcidIcon className="h-5 w-5" /></a>
            <a href={`mailto:${PROFILE.email}`} className="hidden items-center gap-1 text-sm transition-colors hover:text-paper md:flex">
              {PROFILE.email}
              <ArrowDownRight size={14} />
            </a>
          </div>
        </motion.div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-24 md:px-6">
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="bg-ink/80 p-6 backdrop-blur-xl md:p-8">
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <CountUp value={s.value} prefix={s.prefix} suffix={s.suffix} className="font-display text-5xl tracking-tight text-paper md:text-6xl" />
                <p className="mt-3 max-w-[16rem] text-sm leading-snug text-muted">{s.label}</p>
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
