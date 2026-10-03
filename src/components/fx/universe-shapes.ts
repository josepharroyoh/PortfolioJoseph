// Point clouds the background particles morph between, one per section.
// Every builder returns N points as [x, y, z, x, y, z, ...], roughly inside a unit sphere.

export type ShapeKey = "fieldlines" | "globe" | "aurora" | "planet" | "galaxy" | "atmosphere" | "lorenz" | "lightning" | "dipole" | "wave";

/** Which figure the particles form while each section is on screen. */
const SECTION_SHAPE: Record<string, ShapeKey> = {
  home: "galaxy",
  academic: "galaxy",
  awards: "lorenz",
  experience: "fieldlines",
  projects: "lightning",
  skills: "globe",
  training: "wave",
  volunteering: "atmosphere",
  contact: "galaxy",
  thesis: "lightning",
  cv: "galaxy",
};
export const sectionShape = (section: string): ShapeKey => SECTION_SHAPE[section] ?? "planet";

/** How each shape is shown: tilt towards the viewer, spin speed and size. */
export const SHAPE_VIEW: Record<ShapeKey, { tilt: number; spin: number; scale: number }> = {
  fieldlines: { tilt: 0.25, spin: 0.35, scale: 1.15 },
  globe: { tilt: 0.38, spin: 0.5, scale: 1.05 },
  aurora: { tilt: 0.2, spin: 0.3, scale: 1.15 },
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

/** Electric field lines of a dipole, revolved around its axis: the textbook figure in particles. */
function fieldlines(n: number) {
  const out = new Float32Array(n * 3);
  const q = 0.42;
  const lines: number[][] = [];
  const LINES = 14;
  for (let k = 0; k < LINES; k++) {
    const a0 = ((k + 0.5) / LINES) * Math.PI; // upper half-plane, mirrored below
    let x = q + Math.cos(a0) * 0.04;
    let y = Math.sin(a0) * 0.04;
    const pts: number[] = [];
    for (let step = 0; step < 900; step++) {
      const d1 = Math.hypot(x - q, y) ** 3 || 1e-6;
      const d2 = Math.hypot(x + q, y) ** 3 || 1e-6;
      let ex = (x - q) / d1 - (x + q) / d2;
      let ey = y / d1 - y / d2;
      const m = Math.hypot(ex, ey) || 1;
      ex /= m;
      ey /= m;
      x += ex * 0.006;
      y += ey * 0.006;
      pts.push(x, y);
      if (Math.hypot(x + q, y) < 0.03 || Math.abs(x) > 1.4 || Math.abs(y) > 1.1) break;
    }
    lines.push(pts);
  }
  const total = lines.reduce((t, l) => t + l.length / 2, 0);
  const charges = Math.floor(n * 0.06);
  for (let i = 0; i < n; i++) {
    if (i < charges) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.random() * 0.035;
      const sx = i % 2 ? q : -q;
      out[i * 3] = sx + Math.cos(a) * r;
      out[i * 3 + 1] = Math.sin(a) * r;
      out[i * 3 + 2] = (Math.random() - 0.5) * 0.04;
      continue;
    }
    // Pick a point along a random line, a random side, and one of four azimuthal planes.
    let pick = Math.floor(Math.random() * total);
    let line = lines[0];
    for (const l of lines) {
      if (pick < l.length / 2) {
        line = l;
        break;
      }
      pick -= l.length / 2;
    }
    const px = line[pick * 2] ?? 0;
    const py = (line[pick * 2 + 1] ?? 0) * (Math.random() < 0.5 ? 1 : -1);
    const phi = (Math.floor(Math.random() * 4) / 4) * Math.PI;
    out[i * 3] = px;
    out[i * 3 + 1] = py * Math.cos(phi);
    out[i * 3 + 2] = py * Math.sin(phi);
  }
  return out;
}

/** A wireframe globe: meridians and parallels in particles, like an armillary sphere. */
function globe(n: number) {
  const out = new Float32Array(n * 3);
  const R = 0.78;
  for (let i = 0; i < n; i++) {
    const meridian = i % 3 !== 0;
    let lat: number, lon: number;
    if (meridian) {
      lon = (Math.floor(Math.random() * 12) / 12) * Math.PI * 2;
      lat = (Math.random() - 0.5) * Math.PI;
    } else {
      lat = ((Math.floor(Math.random() * 7) - 3) / 4) * (Math.PI / 2);
      lon = Math.random() * Math.PI * 2;
    }
    const j = (Math.random() - 0.5) * 0.006;
    out[i * 3] = (R + j) * Math.cos(lat) * Math.cos(lon);
    out[i * 3 + 1] = (R + j) * Math.sin(lat);
    out[i * 3 + 2] = (R + j) * Math.cos(lat) * Math.sin(lon);
  }
  return out;
}

/** Aurora curtains: folded ribbons of light, brightest at their lower edge. */
function aurora(n: number) {
  const out = new Float32Array(n * 3);
  const CURTAINS = 3;
  for (let i = 0; i < n; i++) {
    const c = i % CURTAINS;
    const u = Math.random() * 2 - 1;
    const z = (c - 1) * 0.35 + Math.sin(u * 3 + c) * 0.12;
    const base = -0.35 + Math.sin(u * 2.2 + c * 1.7) * 0.12;
    const hgt = 0.55 + 0.25 * Math.sin(u * 1.3 + c);
    const v = Math.pow(Math.random(), 2.2); // dense at the bottom edge
    out[i * 3] = u * 1.1;
    out[i * 3 + 1] = -(base + v * hgt);
    out[i * 3 + 2] = z;
  }
  return out;
}

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

export const SHAPES: Record<ShapeKey, (n: number) => Float32Array> = { fieldlines, globe, aurora, planet, galaxy, atmosphere, lorenz, lightning, dipole, wave };
