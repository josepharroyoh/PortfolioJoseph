// src/pages/CVPage.tsx

import { Link } from "react-router-dom";

export const CVPage = () => {
  return (
    <div className="bg-background text-foreground min-h-screen p-8">
      <header className="mb-8">
        <Link to="/" className="text-pink-500 hover:underline">
          &larr; Volver al inicio
        </Link>
      </header>
      <main>
        <h1 className="text-4xl font-bold mb-4">Mi Trayectoria Profesional (CV)</h1>
        <p>
          Aquí puedes empezar a construir tu CV. Puedes añadir secciones como
          Experiencia Laboral, Proyectos Destacados, etc.
        </p>
        {/* Aquí es donde armarás el contenido de tu CV */}
      </main>
    </div>
  );
};