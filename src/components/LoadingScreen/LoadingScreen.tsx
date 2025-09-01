"use client";
import React, { useEffect, useState } from "react";
import "./loading-screen.css";

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("Initializing protocols...");
  const [logs, setLogs] = useState<string[]>([]);
  const [divergenceReadout, setDivergenceReadout] = useState("?.??????");

  useEffect(() => {
    // --- Lógica de la barra de progreso ---
    const totalDuration = 3500;
    let startTime = Date.now();
    const intervalId = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const newProgress = (elapsedTime / totalDuration) * 100;
      if (newProgress >= 100) {
        setProgress(100);
        clearInterval(intervalId);
        // Retraso final para dar tiempo a la página de cargar
        setTimeout(() => onComplete(), 1300);
      } else {
        setProgress(Math.round(newProgress));
      }
    }, 50);

    // --- Lógica de mensajes y logs ---
    const messageSequence = [
      { delay: 100, update: () => setStatusMessage("Establishing secure connection...") },
      { delay: 100, update: () => setLogs(prev => {
        const newLogs = [...prev, "[OK] Divergence field detected"];
        if (newLogs.length > 4) return newLogs.slice(1);
        return newLogs;
      }) },
      { delay: 150, update: () => setStatusMessage("Loading user interface...") },
      { delay: 100, update: () => setLogs(prev => {
        const newLogs = [...prev, "[SYS] Reading Steiner sync..."];
        if (newLogs.length > 4) return newLogs.slice(1);
        return newLogs;
      }) },
      { delay: 150, update: () => setStatusMessage("Finalizing...") },
      { delay: 100, update: () => setLogs(prev => {
        const newLogs = [...prev, "[WARN] Time-leap machine unstable"];
        if (newLogs.length > 4) return newLogs.slice(1);
        return newLogs;
      }) },
      { delay: 100, update: () => setLogs(prev => {
        const newLogs = [...prev, "[OK] Worldline data loaded"];
        if (newLogs.length > 4) return newLogs.slice(1);
        return newLogs;
      }) },
      { delay: 150, update: () => setLogs(prev => {
        const newLogs = [...prev, "[SYS] Entropy stabilized"];
        if (newLogs.length > 4) return newLogs.slice(1);
        return newLogs;
      }) },
      { delay: 100, update: () => setStatusMessage("Welcome.") },
    ];

    let totalDelay = 0;
    messageSequence.forEach((item) => {
      totalDelay += item.delay;
      setTimeout(item.update, totalDelay);
    });

    // --- Lógica de animación del medidor y partículas ---
    const flickerInterval = setInterval(() => {
      if (progress < 100) {
        let randomDivergence = Math.random() * 2;
        const paddedValue = (randomDivergence * 1000000).toFixed(0).padStart(7, '0');
        setDivergenceReadout(`${paddedValue.slice(0, 1)}.${paddedValue.slice(1)}`);
      } else {
        clearInterval(flickerInterval);
        setDivergenceReadout("1.048596");
      }
    }, 60);

    const particleContainer = document.querySelector(".particles");
    if (particleContainer) {
      const particleCount = 40;
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement("span");
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDuration = `${Math.random() * 8 + 5}s`;
        particle.style.animationDelay = `${Math.random() * -15}s`;
        particleContainer.appendChild(particle);
      }
    }

    return () => {
      clearInterval(intervalId);
      clearInterval(flickerInterval);
    };
  }, [onComplete]);

  return (
    <div className="loader-container">
      <div className="crt-overlay"></div>
      <div className="particles"></div>
      <div className="terminal-logs">
        {logs.map((log, i) => (
          <p key={i} className="log-line">
            {log}
          </p>
        ))}
      </div>
      <div className="divergence-meter-widget">
        <span className="widget-label">DIVERGENCE</span>
        <span className="widget-value">{divergenceReadout}%</span>
      </div>
      <div className="loader-box">
        <h1 className="protocol-title glitch" data-text="SYSTEM BOOT">SYSTEM BOOT</h1>
        <div className="status-wrapper">
          <p className="status-text">{statusMessage}</p>
        </div>
        <div className="progress-wrapper">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
        {progress === 100 && (
          <p className="completion-quote fade-in">
            "El Psy Kongroo."
          </p>
        )}
      </div>
    </div>
  );
};