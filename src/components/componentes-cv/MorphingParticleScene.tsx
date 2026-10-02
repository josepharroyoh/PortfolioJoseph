import { useEffect, useRef } from "react";
import * as THREE from "three";
import { clamp01, smoothstep } from "./cv-utils";
import {
  PARTICLE_COUNT, TOTAL_SECTIONS,
  SHAPES_BUILDERS, SECTION_EULER, TINTS
} from "./cv-particles";
import SectionIndicator from "./SectionIndicator";

type Props = {
  currentSection: number;
  setCurrentSection: (n: number) => void;
  setSettledSection: (n: number) => void;
};

export default function MorphingParticleScene({
  currentSection,
  setCurrentSection,
  setSettledSection,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dominantSectionRef = useRef(0);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    camera.position.z = 50;

    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const targetPositions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const speeds = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 100;
      positions[i3 + 1] = (Math.random() - 0.5) * 100;
      positions[i3 + 2] = (Math.random() - 0.5) * 50;
      speeds[i] = 0.015 + Math.random() * 0.035;
      const base = 0.88 + Math.random() * 0.12;
      colors[i3] = base; colors[i3 + 1] = base; colors[i3 + 2] = base;
    }

    const shapes = SHAPES_BUILDERS.map(fn => fn());
    for (let i = 0; i < PARTICLE_COUNT * 3; i++) targetPositions[i] = shapes[0][i];

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({
      size: 0.16, vertexColors: true, transparent: true, opacity: 0.95,
      blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
      color: TINTS[0].clone(),
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const targetRot = new THREE.Euler();
    const tmpEuler = new THREE.Euler();
    targetRot.copy(SECTION_EULER[0]);
    points.rotation.copy(targetRot);

    const DEAD_ZONE = 0.2;

    const onScroll = () => {
      const sProg = window.scrollY / window.innerHeight;
      const steps = TOTAL_SECTIONS - 1;
      const iA = Math.max(0, Math.min(steps, Math.floor(sProg)));
      const iB = Math.max(0, Math.min(steps, iA + 1));
      const t = sProg - iA;
      const tRemap = clamp01((t - DEAD_ZONE) / Math.max(1e-6, 1 - 2 * DEAD_ZONE));
      const tEase = smoothstep(tRemap);

      for (let i = 0; i < PARTICLE_COUNT * 3; i++) {
        const a = shapes[iA][i], b = shapes[iB][i];
        targetPositions[i] = a + (b - a) * tEase;
      }

      material.color.copy(TINTS[iA].clone().lerp(TINTS[iB], tEase));

      tmpEuler.setFromVector3(
        new THREE.Vector3(SECTION_EULER[iA].x, SECTION_EULER[iA].y, SECTION_EULER[iA].z)
          .lerp(new THREE.Vector3(SECTION_EULER[iB].x, SECTION_EULER[iB].y, SECTION_EULER[iB].z), tEase)
      );
      targetRot.copy(tmpEuler);

      const dom = Math.max(0, Math.min(steps, Math.round(sProg)));
      if (dom !== dominantSectionRef.current) {
        dominantSectionRef.current = dom;
        setCurrentSection(dom);
      }

      if (t <= DEAD_ZONE) setSettledSection(iA);
      else if (t >= 1 - DEAD_ZONE) setSettledSection(iB);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    let raf = 0; let time = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      time += 0.008;
      const pos = geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3, s = speeds[i];
        pos[i3]     += (targetPositions[i3]     - pos[i3])     * s;
        pos[i3 + 1] += (targetPositions[i3 + 1] - pos[i3 + 1]) * s;
        pos[i3 + 2] += (targetPositions[i3 + 2] - pos[i3 + 2]) * s;
        pos[i3]     += Math.sin(time + i * 0.011) * 0.008;
        pos[i3 + 1] += Math.cos(time + i * 0.013) * 0.008;
      }
      (geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;

      points.rotation.x += (targetRot.x - points.rotation.x) * 0.08;
      points.rotation.y += (targetRot.y - points.rotation.y) * 0.08;
      points.rotation.z += (targetRot.z - points.rotation.z) * 0.08;

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      onScroll();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, [setCurrentSection, setSettledSection]);

  return (
    <>
      {/* IMPORTANTE: sin bg y con z-[2] */}
      <canvas ref={canvasRef} className="fixed inset-0 z-[2] w-full h-full" />
      <SectionIndicator currentSection={currentSection} />
    </>
  );
}
