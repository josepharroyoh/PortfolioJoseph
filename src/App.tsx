// src/App.tsx

import { useState, useEffect, useCallback } from "react";
import { Routes, Route, useLocation } from "react-router-dom"; // <--- Importamos useLocation
import { PortfolioLayout } from "../src/PortfolioLayout";
import { CVPage } from "./pages/CVPage";
import { LoadingScreen } from "./components/LoadingScreen/LoadingScreen";
import "./App.css";

// --- Nueva función para decidir el estado de carga inicial ---
const getInitialLoadingState = () => {
  // Verificamos si ya se mostró la carga en esta sesión
  const hasLoadedInSession = sessionStorage.getItem('hasLoadedBefore');
  // Obtenemos la ruta actual
  const currentPath = window.location.pathname;

  // Si ya se cargó antes Y NO estamos en la página principal, entonces NO mostramos la carga.
  if (hasLoadedInSession && currentPath !== '/') {
    return false;
  }

  // En cualquier otro caso (primera visita o recarga en la página principal), SI la mostramos.
  return true;
};


function App() {
  // Usamos la función para establecer el estado inicial de isLoading
  const [isLoading, setIsLoading] = useState(getInitialLoadingState);

  // El hook useLocation nos da la ruta actual de forma reactiva
  const location = useLocation();

  const handleLoadingComplete = useCallback(() => {
    // Marcamos en la sesión que la carga ya se completó
    sessionStorage.setItem('hasLoadedBefore', 'true');
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isLoading) {
      document.body.classList.add('loading-active');
    } else {
      document.body.classList.remove('loading-active');
    }
    return () => {
      document.body.classList.remove('loading-active');
    };
  }, [isLoading]);

  return (
    <>
      {isLoading ? (
        <LoadingScreen onComplete={handleLoadingComplete} />
      ) : (
        <Routes>
          <Route path="/" element={<PortfolioLayout />} />
          <Route path="/cv" element={<CVPage />} />
        </Routes>
      )}
    </>
  );
}

export default App;