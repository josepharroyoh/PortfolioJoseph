// src/components/HeaderNav.tsx

// CAMBIO 1: Añadimos "titles" a la definición de tus Props.
type Props = {
  settledSection: number;
  onClickItem: (index: number) => void;
  titles: string[];
};

// CAMBIO 2: Eliminamos la constante NAV_TITLES. Ya no es necesaria.
// const NAV_TITLES = [ ... ];

// CAMBIO 3: Añadimos "titles" a los parámetros que recibe el componente.
export default function HeaderNav({ settledSection, onClickItem, titles }: Props) {
  return (
    <nav className="fixed top-10 right-7 z-40 flex flex-col items-end gap-2">
      {/* CAMBIO 4: Hacemos el .map() sobre "titles" en lugar de NAV_TITLES. */}
      {titles.map((item, index) => (
        <button
          key={item}
          onClick={() => onClickItem(index)}
          className={`
            text-white text-sm font-light tracking-[0.2em] transition-all duration-300
            ${settledSection === index
              ? "opacity-100"
              : "opacity-60 hover:opacity-80 hover:translate-x-1"}
          `}
        >
          {item}
        </button>
      ))}
    </nav>
  );
}