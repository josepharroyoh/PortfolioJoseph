// src/components/Carousel3D/Carousel3D.tsx
"use client";

import React, { useRef, useEffect, useState } from "react";
import type { TouchEvent } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useMediaQuery } from '../hooks/useMediaQuery';

export interface Carousel3DItem {
  id: string | number;
  imageUrl: string;
  brand: string;
  title: string;
  description: string;
  tags: string[];
  link: string;
}

interface Carousel3DProps {
  items: Carousel3DItem[];
  autoRotate?: boolean;
  rotateInterval?: number;
  cardHeight?: number;
}

const Carousel3D: React.FC<Carousel3DProps> = ({ items, autoRotate = true, rotateInterval = 4000, cardHeight = 500 }) => {
  const [active, setActive] = useState(0);
  const [hoveredItemId, setHoveredItemId] = useState<string | number | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [isInView, setIsInView] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const minSwipeDistance = 50;

  useEffect(() => {
    if (autoRotate && isInView && !isHovering) {
      const interval = setInterval(() => {
        setActive((prev) => (prev + 1) % items.length);
      }, rotateInterval);
      return () => clearInterval(interval);
    }
  }, [isInView, isHovering, autoRotate, rotateInterval, items.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.2 }
    );
    if (carouselRef.current) observer.observe(carouselRef.current);
    return () => {
      if(carouselRef.current) observer.unobserve(carouselRef.current)
    };
  }, []);
  
  const onTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(null);
  };

  const onTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) {
      setActive((prev) => (prev + 1) % items.length);
    } else if (distance < -minSwipeDistance) {
      setActive((prev) => (prev - 1 + items.length) % items.length);
    }
  };

  const getCardAnimationClass = (index: number) => {
    if (index === active) return "scale-100 opacity-100 z-20";
    if (index === (active + 1) % items.length)
      return "translate-x-[40%] scale-95 z-10";
    if (index === (active - 1 + items.length) % items.length)
      return "translate-x-[-40%] scale-95 z-10";
    return "scale-90 opacity-0";
  };
  
  const meshHeaderStyle: React.CSSProperties = {
    backgroundImage: `
      radial-gradient(120% 160% at -20% 30%, rgba(200,0,0,0.95) 0%, rgba(120,0,0,0.75) 25%, rgba(80,0,0,0.35) 55%, rgba(40,0,0,0) 80%),
      radial-gradient(100% 140% at 95% 15%, rgba(0,50,150,0.95) 0%, rgba(0,40,120,0.7) 35%, rgba(0,25,80,0.35) 65%, rgba(0,20,50,0) 90%),
      radial-gradient(90% 140% at 90% 100%, rgba(160,110,60,0.85) 0%, rgba(120,80,40,0.5) 35%, rgba(80,50,25,0.25) 65%, rgba(40,25,10,0) 90%),
      linear-gradient(135deg, #000000 0%, #050505 40%, #0a0d2a 95%)
    `,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  return (
    <section id="carousel3d" className="bg-transparent w-full mx-auto flex items-center justify-center py-12 md:py-20">
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div
          className="relative overflow-hidden h-[550px]"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          ref={carouselRef}
        >
          {/* Cards */}
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
            {items.map((item, index) => {
              const hasMedia = item.imageUrl && item.imageUrl !== '#';
              const isVideo = hasMedia && item.imageUrl.endsWith('.mp4');

              return (
                <div
                  key={item.id}
                  className={`absolute top-0 w-full max-w-md transform transition-all duration-500 ${getCardAnimationClass(
                    index
                  )}`}
                >
                  <div
                    className={`overflow-hidden shadow-2xl rounded-xl flex flex-col`}
                    style={{ height: `${cardHeight}px` }}
                  >
                    <div
                      className="relative p-6 flex items-center justify-center h-48 overflow-hidden text-white rounded-t-xl"
                      style={!hasMedia ? meshHeaderStyle : {}}
                    >
                      {hasMedia && (
                        isVideo ? (
                          <video
                            src={item.imageUrl}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        ) : (
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        )
                      )}
                      
                      <div className={`absolute inset-0 ${isVideo ? 'bg-black/40' : 'bg-black/55'}`} />

                      {/* --- CAMBIO AQUÍ: El texto solo se muestra si NO hay video o imagen --- */}
                      {!hasMedia && (
                        <div className="relative z-10 text-center">
                          <h3 className="text-2xl font-bold tracking-wider mb-2">
                            {item.brand.toUpperCase()}
                          </h3>
                          <div className="w-12 h-1 bg-white rounded-full mx-auto mb-4"></div>
                          <p className="text-base text-gray-300">{item.title}</p>
                        </div>
                      )}
                    </div>

                    <div className="p-6 flex flex-col flex-grow bg-black">
                      <h3 className="text-xl font-bold mb-1 text-white">
                        {item.title}
                      </h3>
                      <p className="text-gray-400 text-sm font-medium mb-3">
                        {item.brand}
                      </p>
                      <p className="text-gray-400 text-sm flex-grow">
                        {item.description}
                      </p>
                      <div className="mt-auto pt-4 relative">
                        <div className="flex flex-wrap gap-2 mb-4">
                          {item.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-white text-black font-medium rounded-full text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onMouseEnter={() => setHoveredItemId(item.id)}
                          onMouseLeave={() => setHoveredItemId(null)}
                          className="text-gray-400 hover:text-white transition-colors text-sm inline-flex items-center"
                        >
                          Más información
                          <ArrowRight className={`ml-2 w-4 h-4 transition-transform ${hoveredItemId === item.id ? 'translate-x-1' : ''}`} />
                        </a>
                        <span
                          className={`absolute bottom-0 left-0 h-px bg-gray-400/60 transition-all duration-500 ease-out ${hoveredItemId === item.id ? 'w-full' : 'w-0'}`}
                        ></span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Arrows */}
          {!isMobile && (
            <>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-gray-200/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-800 hover:bg-white z-30 shadow-lg transition-all hover:scale-110"
                onClick={() =>
                  setActive((prev) => (prev - 1 + items.length) % items.length)
                }
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-gray-200/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-800 hover:bg-white z-30 shadow-lg transition-all hover:scale-110"
                onClick={() =>
                  setActive((prev) => (prev + 1) % items.length)
                }
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Dots */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center space-x-3 z-30">
            {items.map((_, idx) => (
              <button
                key={idx}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  active === idx
                    ? "bg-white w-6"
                    : "bg-gray-600 hover:bg-gray-400"
                }`}
                onClick={() => setActive(idx)}
                aria-label={`Go to item ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Carousel3D;