import { SECTION_TITLES, TOTAL_SECTIONS } from "./cv-particles";

type Props = { currentSection: number };

export default function SectionIndicator({ currentSection }: Props) {
  return (
    <div className="fixed right-[25vw] top-1/2 -translate-y-1/2 z-50 text-white text-right select-none pointer-events-none font-tech-mono tracking-widest">
      <div className="opacity-70 text-xs mb-1">{SECTION_TITLES[currentSection]}</div>
      <div className="text-2xl font-bold flex items-end justify-end">
        <div className="relative overflow-hidden leading-none" style={{ height: "1em", width: "1ch" }}>
          {Array.from({ length: TOTAL_SECTIONS }).map((_, index) => (
            <span
              key={index}
              className="absolute right-0 transition-all duration-500 ease-in-out"
              style={{ transform: `translateY(${(index - currentSection) * 100}%)` }}
            >
              {index + 1}
            </span>
          ))}
        </div>
        <span className="opacity-40 text-lg leading-none">/{TOTAL_SECTIONS}</span>
      </div>
    </div>
  );
}
