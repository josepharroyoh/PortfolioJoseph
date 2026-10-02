import { useEffect, useRef } from "react";
import * as THREE from "three";

type Props = {
  count?: number;
  depth?: number;
  spread?: number;
  baseSpeed?: number;     // reposo real
  accel?: number;         // ganancia para convertir vel. de scroll → impulso
  sway?: number;
  swayFreq?: number;
  size?: number;
  color?: string;         // puntos (blanco)
  excludeRadius?: number;
  repelStrength?: number;

  // Trazo/blur al acelerar (líneas blancas)
  streakBase?: number;    // longitud base mínima del trazo
  streakScale?: number;   // cuánto crece con el impulso
  streakOpacityMax?: number; // opacidad máxima de los trazos
  streakThreshold?: number;  // umbral a partir del cual se muestran (impulso)
  streakJitter?: number;     // ondulación lateral sutil del trazo
};

export default function ParallaxParticleField({
  count = 100,
  depth = 240,
  spread = 42,
  baseSpeed = 0.02,
  accel = 0.004,
  sway = 1.0,
  swayFreq = 0.5,
  size = 0.07,
  color = "#ffffff",
  excludeRadius = 24,
  repelStrength = 0.05,

  streakBase = 0.8,
  streakScale = 6.0,
  streakOpacityMax = 0.85,
  streakThreshold = 0.06, // mientras el impulso sea menor, los trazos NO se ven
  streakJitter = 0.55,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Impulso continuo por scroll (no se corta entre secciones)
  const impulse = useRef(0);
  const emaVel = useRef(0);                 // px/ms suavizado
  const lastScrollY = useRef<number>(window.scrollY);
  const lastTs = useRef<number>(performance.now());

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 4.5;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const sampleAnnulus = (innerR: number, outerR: number) => {
      const u = Math.random();
      const r = Math.sqrt(u * (outerR * outerR - innerR * innerR) + innerR * innerR);
      const th = Math.random() * Math.PI * 2;
      return { x: r * Math.cos(th), y: r * Math.sin(th) };
    };

    // buffers
    const positions = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    const speeds = new Float32Array(count);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const p = sampleAnnulus(excludeRadius, spread);
      positions[i3] = p.x;
      positions[i3 + 1] = p.y;
      positions[i3 + 2] = -rand(0, depth);
      phases[i] = Math.random() * Math.PI * 2;
      speeds[i] = 0.8 + Math.random() * 0.6;
      sizes[i] = 0.7 + Math.random() * 0.9;
    }

    // Puntos blancos (reposo visible)
    const geomPoints = new THREE.BufferGeometry();
    geomPoints.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const matPoints = new THREE.PointsMaterial({
      size,
      sizeAttenuation: true,
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const meshPoints = new THREE.Points(geomPoints, matPoints);
    scene.add(meshPoints);

    // Trazos (líneas) que SOLO aparecen con impulso
    // Para line segments: 2 vértices por partícula (inicio y fin)
    const streakPositions = new Float32Array(count * 2 * 3);
    const geomStreaks = new THREE.BufferGeometry();
    geomStreaks.setAttribute("position", new THREE.BufferAttribute(streakPositions, 3));
    const matStreaks = new THREE.LineBasicMaterial({
      color: new THREE.Color("#ffffff"),
      transparent: true,
      opacity: 0.0, // en reposo invisible
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const lines = new THREE.LineSegments(geomStreaks, matStreaks);
    scene.add(lines);

    let raf = 0;

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    const animate = () => {
      raf = requestAnimationFrame(animate);

      const now = performance.now();
      const dtMs = Math.min(50, now - lastTs.current);
      lastTs.current = now;

      // Velocidad de scroll continua (EMA)
      const y = window.scrollY;
      const dy = Math.abs(y - lastScrollY.current);
      lastScrollY.current = y;
      const instVel = dy / Math.max(1, dtMs); // px/ms
      const alpha = 0.25; // más alto = más reactivo
      emaVel.current = emaVel.current * (1 - alpha) + instVel * alpha;

      // Integramos impulso (turbo) y lo dejamos decaer solo
      impulse.current = Math.min(impulse.current + emaVel.current * accel * dtMs, 10);
      const decay = impulse.current > 1 ? 0.92 : 0.94;
      impulse.current *= decay;
      if (impulse.current < 0.0005) impulse.current = 0;

      // Factores derivados
      const speedBoost = 1 + impulse.current;
      const swayBoost = 1 + impulse.current * 0.45;
      const sizeBoost = 1 + impulse.current * 0.18;
      matPoints.size = size * sizeBoost;
      matPoints.opacity = Math.min(1, 0.9 + impulse.current * 0.12);

      // Mapeo de impulso → visibilidad de trazo (0 antes del threshold)
      const pulse =
        impulse.current <= streakThreshold
          ? 0
          : Math.min(1, (impulse.current - streakThreshold) / (1.2 - streakThreshold));
      matStreaks.opacity = pulse * streakOpacityMax;

      const pArr = geomPoints.attributes.position.array as Float32Array;
      const sArr = geomStreaks.attributes.position.array as Float32Array;

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;

        // avance hacia cámara
        const zSpeed = (baseSpeed + 0.12 * speeds[i]) * speedBoost;
        pArr[i3 + 2] += zSpeed * (dtMs * 0.06);

        // reciclar detrás
        if (pArr[i3 + 2] > 2) {
          pArr[i3 + 2] = -depth;
          const p = sampleAnnulus(excludeRadius, spread);
          pArr[i3] = p.x;
          pArr[i3 + 1] = p.y;
          phases[i] = Math.random() * Math.PI * 2;
          speeds[i] = 0.8 + Math.random() * 0.6;
          sizes[i] = 0.7 + Math.random() * 0.9;
        }

        // sway lateral orgánico (más cerca = más sway) + boost con impulso
        const z = pArr[i3 + 2];
        const near = 1 - Math.min(1, Math.max(0, (-z) / depth));
        const phase = phases[i] + (0.6 + near) * swayFreq * swayBoost * (now * 0.001);

        pArr[i3]     += Math.sin(phase) * 0.0025 * (1 + near * 0.6);
        pArr[i3 + 1] += Math.cos(phase * 0.9) * 0.0025 * (1 + near * 0.6);

        // repulsión del centro
        if (repelStrength > 0) {
          const x = pArr[i3], yv = pArr[i3 + 1];
          const r2 = x * x + yv * yv;
          if (r2 < excludeRadius * excludeRadius) {
            const r = Math.sqrt(Math.max(1e-6, r2));
            const nx = x / r, ny = yv / r;
            const push = (excludeRadius - r) * (repelStrength + impulse.current * 0.02);
            pArr[i3]     += nx * push;
            pArr[i3 + 1] += ny * push;
          }
        }

        // -------- TRazo/blur (solo visible con pulse>0) --------
        // start = posición actual; end = “detrás” en Z (contrario al movimiento)
        const j = i * 6; // 2 vértices * 3
        const jitterX = Math.sin(phase * 0.8) * streakJitter * 0.02 * (1 + near) * pulse;
        const jitterY = Math.cos(phase * 0.8) * streakJitter * 0.02 * (1 + near) * pulse;

        const len = (streakBase + streakScale * impulse.current * 0.1) * (0.7 + 0.6 * near);

        // start (punta brillante)
        sArr[j]     = pArr[i3];
        sArr[j + 1] = pArr[i3 + 1];
        sArr[j + 2] = pArr[i3 + 2];

        // end (cola hacia atrás)
        sArr[j + 3] = pArr[i3]     - jitterX;
        sArr[j + 4] = pArr[i3 + 1] - jitterY;
        sArr[j + 5] = pArr[i3 + 2] - len;
      }

      (geomPoints.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      (geomStreaks.attributes.position as THREE.BufferAttribute).needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      geomPoints.dispose();
      geomStreaks.dispose();
      matPoints.dispose();
      matStreaks.dispose();
    };
  }, [
    accel, baseSpeed, color, count, depth, size, spread, sway, swayFreq,
    excludeRadius, repelStrength, streakBase, streakScale, streakOpacityMax, streakThreshold, streakJitter,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[1] w-full h-full pointer-events-none"
    />
  );
}
