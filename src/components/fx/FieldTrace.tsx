import { useMemo, useRef } from "react";
import { useInView } from "framer-motion";
import clsx from "clsx";

type Labels = { field: string; threshold: string; alert: string; strike: string; lead: string };

const W = 640;
const H = 260;
const PAD = { l: 8, r: 8, t: 24, b: 44 };
const THRESHOLD = 0.58;
const STRIKE_AT = 0.76;

/** Synthetic field-mill record: the field grows as the storm charges, then a strike knocks it down. */
function sample(t: number) {
  const build = 0.14 + 0.78 * Math.pow(Math.min(t / STRIKE_AT, 1), 2.2);
  const wobble = Math.sin(t * 61) * 0.012 + Math.sin(t * 23 + 1) * 0.018 + Math.sin(t * 7) * 0.02;
  if (t < STRIKE_AT) return build + wobble;
  const after = t - STRIKE_AT;
  return 0.22 + 0.32 * (1 - Math.exp(-after * 9)) + wobble;
}

const x = (t: number) => PAD.l + t * (W - PAD.l - PAD.r);
const y = (v: number) => PAD.t + (1 - v) * (H - PAD.t - PAD.b);

/**
 * Illustrative chart of an electric-field lightning warning: the trace draws
 * itself, the warning fires at the threshold and the lead time is bracketed.
 */
export function FieldTrace({
  labels,
  compact = false,
  replayKey = 0,
  className,
}: {
  labels: Labels;
  compact?: boolean;
  /** Changing this replays the drawing. */
  replayKey?: number;
  className?: string;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });

  const { path, alertT } = useMemo(() => {
    let d = "";
    let alert = 0;
    for (let i = 0; i <= 200; i++) {
      const t = i / 200;
      const v = sample(t);
      if (!alert && v >= THRESHOLD) alert = t;
      d += `${i ? "L" : "M"}${x(t).toFixed(1)} ${y(v).toFixed(1)}`;
    }
    return { path: d, alertT: alert };
  }, []);

  const play = inView;
  const strikeX = x(STRIKE_AT);
  const alertX = x(alertT);

  const pct = (vx: number, vy: number) => ({ left: `${(vx / W) * 100}%`, top: `${(vy / H) * 100}%` });
  const label = "absolute font-mono text-[0.6875rem] leading-none whitespace-nowrap sm:text-xs";

  return (
    <figure className={clsx("relative", className)}>
      <svg
        ref={ref}
        key={replayKey}
        viewBox={`0 0 ${W} ${H}`}
        className={clsx("trace block h-auto w-full overflow-visible", play && "is-playing")}
        role="img"
        aria-label={`${labels.field}: ${labels.alert}, ${labels.strike}, ${labels.lead}`}
      >
        <line x1={PAD.l} x2={W - PAD.r} y1={y(THRESHOLD)} y2={y(THRESHOLD)} stroke="var(--ink)" strokeOpacity="0.35" strokeDasharray="4 5" vectorEffect="non-scaling-stroke" />
        <line x1={PAD.l} x2={W - PAD.r} y1={H - PAD.b} y2={H - PAD.b} stroke="var(--ink)" strokeOpacity="0.2" vectorEffect="non-scaling-stroke" />
        <path d={path} pathLength={1} fill="none" stroke="var(--ink)" strokeWidth="1.8" strokeLinejoin="round" className="trace-line" vectorEffect="non-scaling-stroke" />
        <g className="trace-mark" style={{ animationDelay: "1s" }}>
          <line x1={alertX} x2={alertX} y1={PAD.t} y2={H - PAD.b} stroke="var(--accent)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          <circle cx={alertX} cy={y(THRESHOLD)} r="5" fill="var(--accent)" />
        </g>
        <g className="trace-mark" style={{ animationDelay: "1.35s" }}>
          <line x1={strikeX} x2={strikeX} y1={PAD.t} y2={H - PAD.b} stroke="var(--ink)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        </g>
        <g className="trace-mark" style={{ animationDelay: "1.6s" }}>
          <path
            d={`M${alertX} ${H - PAD.b + 10} v10 M${alertX} ${H - PAD.b + 15} H${strikeX} M${strikeX} ${H - PAD.b + 10} v10`}
            stroke="var(--accent)"
            strokeWidth="1.5"
            fill="none"
            vectorEffect="non-scaling-stroke"
          />
        </g>
      </svg>

      {/* Labels live in HTML so they stay readable at any chart size. */}
      <div aria-hidden="true" className={clsx("trace-labels", play && "is-playing")}>
        {!compact && (
          <span className={clsx(label, "text-muted")} style={{ ...pct(PAD.l, 2) }}>
            {labels.field}
          </span>
        )}
        {!compact && (
          <span className={clsx(label, "-translate-x-full -translate-y-full pb-1 text-muted")} style={pct(W - PAD.r, y(THRESHOLD))}>
            {labels.threshold}
          </span>
        )}
        <span className={clsx(label, "trace-mark -translate-x-full pr-2 font-medium text-accent")} style={{ ...pct(alertX, 2), animationDelay: "1s" }}>
          {labels.alert}
        </span>
        <span className={clsx(label, "trace-mark pl-2 font-medium text-ink")} style={{ ...pct(strikeX, 2), animationDelay: "1.35s" }}>
          {labels.strike}
        </span>
        <span className={clsx(label, "trace-mark -translate-x-1/2 text-accent")} style={{ ...pct((alertX + strikeX) / 2, H - PAD.b + 26), animationDelay: "1.6s" }}>
          {labels.lead}
        </span>
      </div>
    </figure>
  );
}
