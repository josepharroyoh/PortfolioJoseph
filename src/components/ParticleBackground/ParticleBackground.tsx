import React, { useEffect, useRef } from 'react';

// Define las constantes y la clase de partícula
const numParticles = 100;
const particleColor = 'rgba(255, 255, 255, 0.6)';
const lineColor = 'rgba(255, 255, 255, 0.1)';
const maxDistance = 150;
const particleSpeed = 0.5;

class Particle {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  constructor(width: number, height: number) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.size = Math.random() * 2 + 1;
    this.vx = (Math.random() - 0.5) * particleSpeed;
    this.vy = (Math.random() - 0.5) * particleSpeed;
    this.width = width;
    this.height = height;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > this.width) this.vx *= -1;
    if (this.y < 0 || this.y > this.height) this.vy *= -1;
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = particleColor;
    ctx.fill();
  }
}

const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // 👇 Se corrigieron estas líneas para incluir un valor inicial
  const animationFrameId = useRef<number | undefined>(undefined);
  const particles = useRef<Particle[]>([]);
  const mouse = useRef<{ x: number | null, y: number | null }>({ x: null, y: null });

  const initParticles = (width: number, height: number) => {
    particles.current = [];
    for (let i = 0; i < numParticles; i++) {
      particles.current.push(new Particle(width, height));
    }
  };

  const connectParticles = (ctx: CanvasRenderingContext2D) => {
    for (let i = 0; i < particles.current.length; i++) {
      for (let j = i + 1; j < particles.current.length; j++) {
        const dx = particles.current[i].x - particles.current[j].x;
        const dy = particles.current[i].y - particles.current[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < maxDistance) {
          ctx.beginPath();
          ctx.strokeStyle = lineColor;
          ctx.lineWidth = 1;
          ctx.moveTo(particles.current[i].x, particles.current[i].y);
          ctx.lineTo(particles.current[j].x, particles.current[j].y);
          ctx.stroke();
        }
      }
      if (mouse.current.x !== null && mouse.current.y !== null) {
        const dxMouse = particles.current[i].x - mouse.current.x;
        const dyMouse = particles.current[i].y - mouse.current.y;
        const distanceMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        if (distanceMouse < maxDistance / 2) {
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.lineWidth = 1.4;
          ctx.moveTo(particles.current[i].x, particles.current[i].y);
          ctx.lineTo(mouse.current.x, mouse.current.y);
          ctx.stroke();
        }
      }
    }
  };

  const animateParticles = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    particles.current.forEach(particle => {
      particle.update();
      particle.draw(ctx);
    });
    connectParticles(ctx);

    animationFrameId.current = requestAnimationFrame(animateParticles);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(canvas.width, canvas.height);
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouse.current.x = event.clientX;
      mouse.current.y = event.clientY;
    };

    const handleMouseOut = () => {
      mouse.current.x = null;
      mouse.current.y = null;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseOut);
    
    animateParticles();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseOut);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <canvas id="particle-bg" ref={canvasRef} className="absolute inset-0 z-0 opacity-70"></canvas>
  );
};

export default ParticleBackground;