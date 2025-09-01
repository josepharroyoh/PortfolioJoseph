// src/App.tsx

import { Routes, Route } from "react-router-dom";
import  {PortfolioLayout}  from "../src/PortfolioLayout";
import { CVPage } from "./pages/CVPage";
import "./App.css";

function App() {
  return (
    <Routes>
      {/* Cuando la URL es "/", muestra la página principal del portafolio */}
      <Route path="/" element={<PortfolioLayout />} />
      
      {/* Cuando la URL es "/cv", muestra la nueva página del CV */}
      <Route path="/cv" element={<CVPage />} />
    </Routes>
  );
}

export default App;