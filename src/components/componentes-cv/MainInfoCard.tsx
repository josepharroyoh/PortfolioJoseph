// src/components/componentes-cv/MainInfoCard.tsx
import React from 'react';

interface MainInfoCardProps {
  isVisible: boolean;
  scrollHue: number;
  headerComponent?: React.ReactNode;
  children: React.ReactNode;
}

const MainInfoCard: React.FC<MainInfoCardProps> = ({
  isVisible, scrollHue, headerComponent, children
}) => {
  const onBorderMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--mx", `${x}%`);
    el.style.setProperty("--my", `${y}%`);
  };

  const onBorderLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    el.style.setProperty("--mx", `50%`);
    el.style.setProperty("--my", `35%`);
  };

  return (
    <div
      className={`
        pointer-events-auto w-[min(40vw,520px)] h-[calc(100vh-70px)]
        rounded-2xl overflow-hidden
        shadow-[0_8px_40px_-10px_rgba(0,0,0,0.7)]
        relative flex flex-col z-[155]
        transition-all duration-400 ease-out
        ${isVisible ? 'opacity-95 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}
      `}
      style={{ ["--hue" as any]: scrollHue }}
      onMouseMove={onBorderMove}
      onMouseLeave={onBorderLeave}
    >
      <div className="reactive-border rounded-2xl flex-grow overflow-hidden">
        <div className="rounded-2xl bg-black/20 backdrop-blur-lg px-8 pt-0 pb-0 h-full overflow-y-auto custom-scrollbar">
          <div className="mb-8">{headerComponent}</div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainInfoCard;
