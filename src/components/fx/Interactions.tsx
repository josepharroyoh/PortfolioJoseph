import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import type { PointerEvent, ReactNode } from "react";
import clsx from "clsx";
import { useMediaQuery } from "../../hooks/useMediaQuery";

const SPRING = { stiffness: 260, damping: 26, mass: 0.6 };

/** Card that leans toward the cursor in 3D, with a soft sheen where the light hits. */
export function Tilt({ children, className, max = 5 }: { children: ReactNode; className?: string; max?: number }) {
  const fine = useMediaQuery("(hover: hover) and (pointer: fine)");
  const reduced = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, SPRING);
  const sy = useSpring(py, SPRING);
  const transform = useTransform([sx, sy], ([x, y]: number[]) => `perspective(900px) rotateX(${(0.5 - y) * max}deg) rotateY(${(x - 0.5) * max}deg)`);
  const sheen = useTransform([sx, sy], ([x, y]: number[]) => `radial-gradient(420px circle at ${x * 100}% ${y * 100}%, rgb(255 255 255 / 0.14), transparent 60%)`);
  const [hover, setHover] = useState(false);
  const active = fine && !reduced;

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const reset = () => {
    px.set(0.5);
    py.set(0.5);
    setHover(false);
  };

  if (!active) return <div className={className}>{children}</div>;
  return (
    <motion.div
      onPointerMove={onMove}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={reset}
      style={{ transform }}
      className={clsx("relative will-change-transform", className)}
    >
      {children}
      <motion.div
        aria-hidden="true"
        style={{ background: sheen }}
        className={clsx("pointer-events-none absolute inset-0 transition-opacity duration-300", hover ? "opacity-100" : "opacity-0")}
      />
    </motion.div>
  );
}

/** Wraps a button so it drifts a few pixels toward the cursor. */
export function Magnetic({ children, strength = 0.25 }: { children: ReactNode; strength?: number }) {
  const fine = useMediaQuery("(hover: hover) and (pointer: fine)");
  const reduced = useReducedMotion();
  const x = useSpring(0, { stiffness: 300, damping: 20 });
  const y = useSpring(0, { stiffness: 300, damping: 20 });
  const transform = useTransform([x, y], ([a, b]: number[]) => `translate(${a}px, ${b}px)`);

  if (!fine || reduced) return <>{children}</>;
  return (
    <motion.span
      className="inline-block"
      style={{ transform }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * strength);
        y.set((e.clientY - r.top - r.height / 2) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}

/** Heading whose words rise out of a mask, one after another, when it scrolls into view. */
export function Words({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const words = text.split(" ");
  return (
    <motion.span className={clsx("inline", className)} initial="out" whileInView="in" viewport={{ once: true, margin: "0px 0px -12% 0px" }}>
      {words.map((w, i) => (
        <span key={`${w}-${i}`} className="inline-block overflow-hidden pb-[0.1em] align-bottom">
          <motion.span
            className="inline-block"
            variants={{
              out: { transform: "translateY(105%)" },
              in: { transform: "translateY(0%)", transition: { duration: 0.8, delay: delay + i * 0.06, ease: [0.23, 1, 0.32, 1] } },
            }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 && " "}
        </span>
      ))}
    </motion.span>
  );
}

/**
 * A ring that trails the pointer and swells over anything clickable;
 * over project media it reads "Ver". Fine pointers only.
 */
export function CursorAura() {
  const fine = useMediaQuery("(hover: hover) and (pointer: fine)");
  const reduced = useReducedMotion();
  const x = useSpring(-100, { stiffness: 500, damping: 40, mass: 0.5 });
  const y = useSpring(-100, { stiffness: 500, damping: 40, mass: 0.5 });
  const [mode, setMode] = useState<"idle" | "link" | "view" | "hidden">("hidden");
  const [label, setLabel] = useState("");

  useEffect(() => {
    if (!fine || reduced) return;
    const onMove = (e: globalThis.PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      const el = (e.target as HTMLElement | null)?.closest?.("[data-cursor], a, button, input, textarea, [role=radio]") as HTMLElement | null;
      if (el?.dataset.cursor) {
        setLabel(el.dataset.cursor);
        setMode("view");
      } else setMode(el ? "link" : "idle");
    };
    const onLeave = () => setMode("hidden");
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [fine, reduced, x, y]);

  if (!fine || reduced) return null;
  const size = mode === "view" ? 76 : mode === "link" ? 44 : 22;
  return (
    <motion.div aria-hidden="true" style={{ x, y }} className="no-print pointer-events-none fixed top-0 left-0 z-[80]">
      <div
        className={clsx(
          "grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border text-[12px] font-medium transition-[width,height,background-color,border-color,opacity] duration-300 ease-out",
          mode === "view" ? "border-transparent bg-accent text-on-accent" : mode === "link" ? "border-accent bg-accent-soft" : "border-line-strong",
          mode === "hidden" ? "opacity-0" : "opacity-100",
        )}
        style={{ width: size, height: size }}
      >
        {mode === "view" && label}
      </div>
    </motion.div>
  );
}
