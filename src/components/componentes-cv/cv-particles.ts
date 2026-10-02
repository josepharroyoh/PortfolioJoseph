import * as THREE from "three";
import { gauss, superformula } from "./cv-utils";

/** --- Constantes y rótulos --- */
export const SECTION_TITLES = [
  "GALAXY",
  "SUPERSHAPE",
  "HELIX",
  "MOBIUS RIBBON",
  "LORENZ ATTRACTOR",
  "PHYLLOTAXIS SPHERE",
  "NEURAL WAVE MESH",
] as const;

export const PARTICLE_COUNT = 12000;
export const TOTAL_SECTIONS = 7;

/** --- Orientaciones por sección --- */
export const SECTION_EULER: THREE.Euler[] = [
  new THREE.Euler(0.00, 0.00, 0),
  new THREE.Euler(0.25, 0.35, 0),
  new THREE.Euler(0.20, 0.30, 0),
  new THREE.Euler(0.30, 0.15, 0),
  new THREE.Euler(0.30, 0.20, 0),
  new THREE.Euler(0.10, 0.10, 0),
  new THREE.Euler(0.35, 0.55, 0),
];

/** --- Paleta por sección --- */
export const TINTS = [
  new THREE.Color("#67e8f9"), new THREE.Color("#a78bfa"),
  new THREE.Color("#34d399"), new THREE.Color("#93c5fd"),
  new THREE.Color("#f43f5e"), new THREE.Color("#22d3ee"),
  new THREE.Color("#f59e0b"),
];

/** ------------------ FIGURAS (todas en este archivo) ------------------ */

export const createSpiralGalaxyShape = () => {
  const shape = new Float32Array(PARTICLE_COUNT * 3);
  const ARMS = 4, R_MAX = 28, TWIST = 1.8, NOISE_ANG = 0.35, Z_THIN = 0.35, CORE_RATIO = 0.13;
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;
    if (i < PARTICLE_COUNT * CORE_RATIO) {
      const r = Math.abs(gauss()) * 2.0;
      const ang = Math.random() * Math.PI * 2;
      shape[i3] = r * Math.cos(ang);
      shape[i3 + 1] = r * Math.sin(ang);
      shape[i3 + 2] = gauss() * 0.25;
      continue;
    }
    const t = Math.random();
    const r = Math.pow(t, 1.6) * R_MAX;
    const arm = Math.floor(Math.random() * ARMS);
    const base = (arm / ARMS) * (Math.PI * 2);
    const ang = base + r * (TWIST / R_MAX) * Math.PI * 2 + gauss() * NOISE_ANG;
    shape[i3] = r * Math.cos(ang);
    shape[i3 + 1] = r * Math.sin(ang);
    const zSpread = Z_THIN * (1.2 - r / R_MAX);
    shape[i3 + 2] = gauss() * Math.max(0.07, zSpread);
  }
  return shape;
};

export const createSupershapeSphere = () => {
  const shape = new Float32Array(PARTICLE_COUNT * 3);
  const params1 = { m: 7, n1: 0.4, n2: 1.7, n3: 1.7 };
  const params2 = { m: 3, n1: 0.3, n2: 1.4, n3: 1.4 };
  const SCALE = 20, THICK = 0.6;
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;
    const theta = (Math.random() - 0.5) * Math.PI;
    const phi = Math.random() * Math.PI * 2 - Math.PI;
    const r1 = superformula(theta, params1.m, params1.n1, params1.n2, params1.n3);
    const r2 = superformula(phi, params2.m, params2.n1, params2.n2, params2.n3);
    const x = SCALE * r1 * Math.cos(theta) * r2 * Math.cos(phi);
    const y = SCALE * r1 * Math.sin(theta);
    const z = SCALE * r1 * r2 * Math.sin(phi);
    const len = Math.max(1e-6, Math.hypot(x, y, z));
    const nx = x / len, ny = y / len, nz = z / len;
    const jitter = gauss() * THICK;
    shape[i3]     = x + nx * jitter;
    shape[i3 + 1] = y + ny * jitter;
    shape[i3 + 2] = z + nz * jitter;
  }
  return shape;
};

export const createHelixShape = () => {
  const shape = new Float32Array(PARTICLE_COUNT * 3);
  const HEIGHT = 35, RADIUS = 8, TURNS = 5, DOTS_PER_RUNG = 3;
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;
    const y = (Math.random() - 0.5) * HEIGHT;
    const angle = (y / HEIGHT) * Math.PI * 2 * TURNS;
    if (i % (DOTS_PER_RUNG + 2) < DOTS_PER_RUNG) {
      const r = Math.random() * RADIUS;
      shape[i3] = r * Math.cos(angle);
      shape[i3 + 1] = y;
      shape[i3 + 2] = r * Math.sin(angle);
    } else {
      const side = i % 2 === 0 ? 1 : -1;
      shape[i3] = RADIUS * Math.cos(angle) * side;
      shape[i3 + 1] = y;
      shape[i3 + 2] = RADIUS * Math.sin(angle) * side;
    }
  }
  return shape;
};

export const createMobiusRibbon = () => {
  const shape = new Float32Array(PARTICLE_COUNT * 3);
  const R = 14;
  const W = 4;
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;
    const u = Math.random() * Math.PI * 2;
    const v = (Math.random() * 2 - 1) * W;
    const x = (R + v * Math.cos(u / 2)) * Math.cos(u);
    const y = (R + v * Math.cos(u / 2)) * Math.sin(u);
    const z = v * Math.sin(u / 2);
    shape[i3]     = x + gauss() * 0.15;
    shape[i3 + 1] = y + gauss() * 0.15;
    shape[i3 + 2] = z + gauss() * 0.15;
  }
  return shape;
};

export const createLorenzAttractor = () => {
  const shape = new Float32Array(PARTICLE_COUNT * 3);
  const sigma = 10;
  const rho = 28;
  const beta = 8 / 3;
  const dt = 0.01;
  let x = 0.1, y = 0, z = 0;
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;
    const dx = sigma * (y - x);
    const dy = x * (rho - z) - y;
    const dz = x * y - beta * z;
    x += dx * dt;
    y += dy * dt;
    z += dz * dt;
    shape[i3]     = x * 1.2;
    shape[i3 + 1] = y * 1.2;
    shape[i3 + 2] = (z - rho + 5) * 1.2;
  }
  return shape;
};

export const createPhyllotaxisSphere = () => {
  const shape = new Float32Array(PARTICLE_COUNT * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  const R = 18;
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;
    const t = (i + 0.5) / PARTICLE_COUNT;
    const phi = i * golden;
    const z = 2 * t - 1;
    const r = Math.sqrt(1 - z * z);
    const x = R * r * Math.cos(phi);
    const y = R * r * Math.sin(phi);
    const zz = R * z;
    shape[i3]     = x + gauss() * 0.05;
    shape[i3 + 1] = y + gauss() * 0.05;
    shape[i3 + 2] = zz + gauss() * 0.05;
  }
  return shape;
};

export const createNeuralWaveMesh = () => {
  const shape = new Float32Array(PARTICLE_COUNT * 3);
  const AMP1 = 2.8, AMP2 = 1.9, F1 = 1.2, F2 = 1.8, SCALE_XY = 16;
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;
    const u = (Math.random() - 0.5) * Math.PI * 2;
    const v = (Math.random() - 0.5) * Math.PI * 2;
    let x = u * (SCALE_XY / Math.PI);
    let y = v * (SCALE_XY / Math.PI);
    const z = AMP1 * Math.sin(F1 * u + 0.6 * Math.cos(v)) + AMP2 * Math.cos(F2 * v + 0.5 * Math.sin(u));
    const w = Math.tanh((x * x + y * y) * 0.01);
    x += 0.8 * w * Math.sin(v);
    y += 0.8 * w * Math.cos(u);
    const len = Math.max(1e-6, Math.hypot(x, y, z));
    const nx = x / len, ny = y / len, nz = z / len;
    const jitter = gauss() * 0.25;
    shape[i3]     = x + nx * jitter;
    shape[i3 + 1] = z + nz * jitter;
    shape[i3 + 2] = y + ny * jitter;
  }
  return shape;
};

/** --- Builder List --- */
export const SHAPES_BUILDERS = [
  createSpiralGalaxyShape,
  createSupershapeSphere,
  createHelixShape,
  createMobiusRibbon,
  createLorenzAttractor,
  createPhyllotaxisSphere,
  createNeuralWaveMesh,
];
