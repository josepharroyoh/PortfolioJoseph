// Point clouds the background particles morph between, one per section.
// Every builder returns N points as [x, y, z, x, y, z, ...], roughly inside a unit sphere.

export type ShapeKey = "planet" | "galaxy" | "atmosphere" | "lorenz" | "lightning" | "dipole" | "wave";

/** Which figure the particles form while each section is on screen. */
const SECTION_SHAPE: Record<string, ShapeKey> = {
  home: "planet",
  academic: "lorenz",
  awards: "wave",
  experience: "dipole",
  projects: "lightning",
  skills: "atmosphere",
  training: "lorenz",
  volunteering: "atmosphere",
  contact: "planet",
  thesis: "lightning",
  cv: "planet",
};
export const sectionShape = (section: string): ShapeKey => SECTION_SHAPE[section] ?? "planet";

/** How each shape is shown: tilt towards the viewer, spin speed and size. */
export const SHAPE_VIEW: Record<ShapeKey, { tilt: number; spin: number; scale: number }> = {
  planet: { tilt: 1.3, spin: 0.45, scale: 1.1 },
  galaxy: { tilt: 1.12, spin: 1, scale: 1 },
  atmosphere: { tilt: 0.35, spin: 1.2, scale: 0.95 },
  lorenz: { tilt: 0.15, spin: 0.8, scale: 1.05 },
  lightning: { tilt: 0.05, spin: 0.35, scale: 1.05 },
  dipole: { tilt: 0.4, spin: 1, scale: 1.05 },
  wave: { tilt: 0.75, spin: 0.6, scale: 1 },
};

const gauss = () => {
  const u = 1 - Math.random();
  const v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
};

/** A ringed planet: a Fibonacci sphere inside a thin ring system with a dark gap, like Saturn. */
function planet(n: number) {
  const out = new Float32Array(n * 3);
  const body = Math.floor(n * 0.24);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    if (i < body) {
      const y = 1 - (i / (body - 1)) * 2;
      const ring = Math.sqrt(1 - y * y);
      const a = i * golden;
      out[i * 3] = Math.cos(a) * ring * 0.3;
      out[i * 3 + 1] = Math.sin(a) * ring * 0.3;
      out[i * 3 + 2] = y * 0.3;
      continue;
    }
    // Three ringlets with dark gaps between them, densest in the middle band.
    const band = Math.random();
    const r = band < 0.25 ? 0.5 + Math.random() * 0.1 : band < 0.75 ? 0.64 + Math.random() * 0.14 : 0.83 + Math.random() * 0.12;
    const a = Math.random() * Math.PI * 2;
    out[i * 3] = Math.cos(a) * r;
    out[i * 3 + 1] = Math.sin(a) * r;
    out[i * 3 + 2] = gauss() * 0.006;
  }
  return out;
}

/** Spiral galaxy: a bright core and three trailing arms. */
function galaxy(n: number) {
  const out = new Float32Array(n * 3);
  const ARMS = 3;
  for (let i = 0; i < n; i++) {
    let x: number, y: number, z: number;
    if (i < n * 0.16) {
      const r = Math.abs(gauss()) * 0.09;
      const a = Math.random() * Math.PI * 2;
      x = r * Math.cos(a);
      y = r * Math.sin(a);
      z = gauss() * 0.03;
    } else {
      const r = Math.pow(Math.random(), 1.6);
      const base = (Math.floor(Math.random() * ARMS) / ARMS) * Math.PI * 2;
      const a = base + r * 3.4 + (gauss() * 0.22) / (0.45 + r);
      x = r * Math.cos(a);
      y = r * Math.sin(a);
      z = gauss() * 0.035 * (1.2 - r);
    }
    out[i * 3] = x;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = z;
  }
  return out;
}

/** The Earth as a Fibonacci sphere, wrapped in a thin atmospheric shell. */
function atmosphere(n: number) {
  const out = new Float32Array(n * 3);
  const surface = Math.floor(n * 0.68);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    let r: number, y: number, a: number;
    if (i < surface) {
      y = 1 - (i / (surface - 1)) * 2;
      a = i * golden;
      r = 0.6;
    } else {
      y = Math.random() * 2 - 1;
      a = Math.random() * Math.PI * 2;
      r = 0.72 + Math.random() * 0.2;
    }
    const ring = Math.sqrt(1 - y * y);
    out[i * 3] = Math.cos(a) * ring * r;
    out[i * 3 + 1] = y * r;
    out[i * 3 + 2] = Math.sin(a) * ring * r;
  }
  return out;
}

/** Lorenz attractor (a meteorologist's discovery): the butterfly of deterministic chaos. */
function lorenz(n: number) {
  const out = new Float32Array(n * 3);
  let x = 0.1, y = 0, z = 0;
  const s = 10, rho = 28, b = 8 / 3, dt = 0.006;
  for (let k = 0; k < 800; k++) {
    const dx = s * (y - x), dy = x * (rho - z) - y, dz = x * y - b * z;
    x += dx * dt; y += dy * dt; z += dz * dt;
  }
  for (let i = 0; i < n; i++) {
    for (let k = 0; k < 2; k++) {
      const dx = s * (y - x), dy = x * (rho - z) - y, dz = x * y - b * z;
      x += dx * dt; y += dy * dt; z += dz * dt;
    }
    out[i * 3] = x / 24;
    out[i * 3 + 1] = -(z - 25) / 24;
    out[i * 3 + 2] = y / 24;
  }
  return out;
}

/** A stepped leader: a branching channel falling from a cloud. */
function lightning(n: number) {
  const out = new Float32Array(n * 3);
  const segs: number[][] = [];
  const grow = (x: number, y: number, z: number, len: number, depth: number) => {
    let px = x, py = y, pz = z;
    const steps = Math.floor(len / 0.06);
    for (let k = 0; k < steps && py > -1; k++) {
      const nx = px + gauss() * 0.045 + (depth ? Math.sign(px - x || 1) * 0.02 : 0);
      const ny = py - 0.05 - Math.random() * 0.03;
      const nz = pz + gauss() * 0.03;
      segs.push([px, py, pz, nx, ny, nz]);
      if (depth < 2 && Math.random() < 0.12) grow(nx, ny, nz, len * 0.4, depth + 1);
      px = nx; py = ny; pz = nz;
    }
  };
  grow(0, 0.55, 0, 1.6, 0);
  const cloud = Math.floor(n * 0.42);
  for (let i = 0; i < n; i++) {
    if (i < cloud) {
      out[i * 3] = gauss() * 0.42;
      out[i * 3 + 1] = 0.72 + gauss() * 0.09;
      out[i * 3 + 2] = gauss() * 0.22;
    } else {
      const sg = segs[Math.floor(Math.random() * segs.length)];
      const t = Math.random();
      out[i * 3] = sg[0] + (sg[3] - sg[0]) * t + gauss() * 0.006;
      out[i * 3 + 1] = sg[1] + (sg[4] - sg[1]) * t;
      out[i * 3 + 2] = sg[2] + (sg[5] - sg[2]) * t + gauss() * 0.006;
    }
  }
  return out;
}

/** The Earth's magnetic field: dipole field lines, r = L sin²θ, around a small planet. */
function dipole(n: number) {
  const out = new Float32Array(n * 3);
  const shells = [0.45, 0.7, 0.95];
  const planet = Math.floor(n * 0.12);
  for (let i = 0; i < n; i++) {
    if (i < planet) {
      const y = Math.random() * 2 - 1;
      const a = Math.random() * Math.PI * 2;
      const ring = Math.sqrt(1 - y * y);
      out[i * 3] = Math.cos(a) * ring * 0.14;
      out[i * 3 + 1] = y * 0.14;
      out[i * 3 + 2] = Math.sin(a) * ring * 0.14;
      continue;
    }
    const L = shells[i % shells.length];
    const phi = (Math.floor(Math.random() * 8) / 8) * Math.PI * 2;
    const th = 0.18 * Math.PI + Math.random() * 0.64 * Math.PI;
    const r = L * Math.sin(th) ** 2;
    const j = () => (Math.random() - 0.5) * 0.008;
    out[i * 3] = r * Math.sin(th) * Math.cos(phi) + j();
    out[i * 3 + 1] = r * Math.cos(th) + j();
    out[i * 3 + 2] = r * Math.sin(th) * Math.sin(phi) + j();
  }
  return out;
}

/** Interfering waves on a sheet, like gravity waves in a stratified atmosphere. */
function wave(n: number) {
  const out = new Float32Array(n * 3);
  const side = Math.ceil(Math.sqrt(n));
  for (let i = 0; i < n; i++) {
    const u = ((i % side) / (side - 1)) * 2 - 1;
    const v = (Math.floor(i / side) / (side - 1)) * 2 - 1;
    out[i * 3] = u;
    out[i * 3 + 1] = 0.16 * Math.sin(3.2 * u + 2 * v) * Math.cos(2.4 * v) + 0.06 * Math.sin(7 * u);
    out[i * 3 + 2] = v;
  }
  return out;
}

export const SHAPES: Record<ShapeKey, (n: number) => Float32Array> = { planet, galaxy, atmosphere, lorenz, lightning, dipole, wave };
