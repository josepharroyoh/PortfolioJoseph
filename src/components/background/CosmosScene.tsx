import { useEffect, useRef } from "react";
import * as THREE from "three";
import { SHAPES_BUILDERS, SECTION_EULER, TINTS } from "./shapes";
import { sceneStore } from "./sceneStore";

/**
 * Fixed full-screen particle universe. The main cloud morphs into a different
 * mathematical shape for each section (see SECTION_SHAPE) and a slow starfield
 * drifts behind it. Reads its target from `sceneStore` every frame.
 */
export default function CosmosScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: THREE.WebGLRenderer;
    try {
      // Opaque canvas cleared to the page colour: additive points on a transparent
      // canvas composite badly under backdrop-filter.
      renderer = new THREE.WebGLRenderer({ canvas, alpha: false, antialias: false, powerPreference: "high-performance" });
    } catch {
      return; // No WebGL: the page still works over the plain background.
    }

    const small = window.matchMedia("(max-width: 767px)").matches;
    const weak = (navigator.hardwareConcurrency ?? 8) <= 4;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const count = small ? 5000 : weak ? 7000 : 11000;

    renderer.setClearColor(0x05060a, 1);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, small ? 1.5 : 2));
    renderer.setSize(window.innerWidth, window.innerHeight, false);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 400);
    camera.position.z = small ? 62 : 50;

    // --- Morphing cloud ---
    const shapes = SHAPES_BUILDERS.map((build) => build(count));
    const positions = new Float32Array(count * 3);
    const target = new Float32Array(shapes[0]);
    const speeds = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 140;
      positions[i3 + 1] = (Math.random() - 0.5) * 140;
      positions[i3 + 2] = (Math.random() - 0.5) * 80;
      speeds[i] = 0.012 + Math.random() * 0.03;
      const shade = 0.75 + Math.random() * 0.25;
      colors[i3] = colors[i3 + 1] = colors[i3 + 2] = shade;
    }
    const cloudGeo = new THREE.BufferGeometry();
    cloudGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    cloudGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const cloudMat = new THREE.PointsMaterial({
      size: small ? 0.22 : 0.17,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: TINTS[0].clone(),
    });
    const cloud = new THREE.Points(cloudGeo, cloudMat);
    const group = new THREE.Group();
    group.add(cloud);
    scene.add(group);

    // --- Starfield ---
    const starCount = small ? 700 : 1400;
    const stars = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      // A shell around the origin: every star stays well beyond the camera,
      // however the field rotates, so none blows up into a big square.
      const r = 140 + Math.random() * 120;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      stars[i * 3] = r * Math.sin(ph) * Math.cos(th);
      stars[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
      stars[i * 3 + 2] = r * Math.cos(ph);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(stars, 3));
    const starMat = new THREE.PointsMaterial({ size: 0.9, color: 0xffffff, transparent: true, opacity: 0.55, depthWrite: false });
    const starfield = new THREE.Points(starGeo, starMat);
    scene.add(starfield);

    // --- Interaction ---
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointer = (e: PointerEvent) => {
      pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    let lastScroll = window.scrollY;
    let spin = 0;

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight, false);
    };
    window.addEventListener("resize", onResize);

    let shown = -1;
    let raf = 0;
    let time = 0;
    const tint = new THREE.Color();
    const baseRot = new THREE.Euler().copy(SECTION_EULER[0]);

    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (document.hidden) return;

      const wanted = sceneStore.shape;
      if (wanted !== shown) {
        shown = wanted;
        target.set(shapes[wanted]);
        baseRot.copy(SECTION_EULER[wanted]);
      }

      time += reduced ? 0.002 : 0.008;
      const pos = cloudGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const s = speeds[i];
        pos[i3] += (target[i3] - pos[i3]) * s + Math.sin(time + i * 0.011) * 0.006;
        pos[i3 + 1] += (target[i3 + 1] - pos[i3 + 1]) * s + Math.cos(time + i * 0.013) * 0.006;
        pos[i3 + 2] += (target[i3 + 2] - pos[i3 + 2]) * s;
      }
      cloudGeo.attributes.position.needsUpdate = true;

      tint.copy(TINTS[shown]);
      cloudMat.color.lerp(tint, 0.04);

      // Scroll speed adds a little extra spin; the pointer tilts the scene.
      const y = window.scrollY;
      if (!reduced) spin += Math.min(Math.abs(y - lastScroll), 120) * 0.00004;
      lastScroll = y;
      spin += reduced ? 0 : 0.0006;
      pointer.x += (pointer.tx - pointer.x) * 0.05;
      pointer.y += (pointer.ty - pointer.y) * 0.05;

      group.rotation.x += (baseRot.x + pointer.y * 0.12 - group.rotation.x) * 0.06;
      group.rotation.y += (baseRot.y + pointer.x * 0.18 + spin - group.rotation.y) * 0.06;

      const hero = sceneStore.hero;
      const offsetX = small ? 0 : hero ? 16 : 0;
      const offsetY = small && hero ? -22 : 0;
      group.position.x += (offsetX - group.position.x) * 0.04;
      group.position.y += (offsetY - group.position.y) * 0.04;
      const opacity = small ? (hero ? 0.75 : 0.35) : hero ? 0.95 : 0.55;
      cloudMat.opacity += (opacity - cloudMat.opacity) * 0.05;

      starfield.rotation.y = time * 0.05 + pointer.x * 0.05;
      starfield.rotation.x = pointer.y * 0.04;

      renderer.render(scene, camera);
    };
    frame();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", onResize);
      cloudGeo.dispose();
      cloudMat.dispose();
      starGeo.dispose();
      starMat.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 h-full w-full" />;
}
