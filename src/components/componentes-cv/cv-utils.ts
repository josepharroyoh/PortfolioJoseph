export const gauss = () => {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
};

export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const smoothstep = (t: number) => t * t * (3 - 2 * t);

export const superformula = (
  angle: number, m: number, n1: number, n2: number, n3: number, a = 1, b = 1
) => {
  const t1 = Math.pow(Math.abs(Math.cos((m * angle) / 4) / a), n2);
  const t2 = Math.pow(Math.abs(Math.sin((m * angle) / 4) / b), n3);
  const r = Math.pow(t1 + t2, -1 / Math.max(1e-6, n1));
  return r;
};
