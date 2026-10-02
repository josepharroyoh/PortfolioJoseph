import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      {/* The old /cv page now lives inside the home page. */}
      <Route path="/cv" element={<Navigate to="/#experience" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
