import { useEffect, useRef } from "react";
import { BAT_FRAMES, BAT_PALETTE, BAT_SIZE } from "./bat-frames";

const FRAME_MS = 400 / BAT_FRAMES.length;

/** Decode the run-length frames into ImageData once, shared by every bat. */
let decoded: ImageData[] | null = null;
function getFrames(): ImageData[] {
  if (decoded) return decoded;
  decoded = BAT_FRAMES.map((rle) => {
    const img = new ImageData(BAT_SIZE, BAT_SIZE);
    let p = 0;
    for (const [, n, ch] of rle.matchAll(/(\d*)([.abc])/g)) {
      const run = n ? Number(n) : 1;
      const hex = BAT_PALETTE[ch];
      for (let k = 0; k < run; k++, p++) {
        if (!hex) continue;
        img.data[p * 4] = parseInt(hex.slice(1, 3), 16);
        img.data[p * 4 + 1] = parseInt(hex.slice(3, 5), 16);
        img.data[p * 4 + 2] = parseInt(hex.slice(5, 7), 16);
        img.data[p * 4 + 3] = 255;
      }
    }
    return img;
  });
  return decoded;
}

type BatProps = { size?: number; className?: string };

/** The flapping pixel-art bat, drawn on a canvas instead of 300 KB of box-shadows. */
export function Bat({ size = 32, className }: BatProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    const frames = getFrames();
    let i = 0;
    ctx.putImageData(frames[0], 0, 0);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      i = (i + 1) % frames.length;
      ctx.putImageData(frames[i], 0, 0);
    }, FRAME_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <canvas
      ref={ref}
      width={BAT_SIZE}
      height={BAT_SIZE}
      aria-hidden="true"
      className={className}
      style={{ width: size, height: size, imageRendering: "pixelated" }}
    />
  );
}

/** The site logo: the bat drawn in light on the dark page, inside a hairline ring that lights up on hover. */
export function BatTile({ size = 36 }: { size?: number }) {
  return (
    <span
      className="inline-grid shrink-0 place-items-center overflow-hidden rounded-full ring-1 ring-line-strong transition-[box-shadow,background-color] duration-300 hover:bg-accent-soft hover:ring-accent"
      style={{ width: size, height: size }}
    >
      <Bat size={size * 0.82} className="invert" />
    </span>
  );
}
