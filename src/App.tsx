import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ThesisPage from "./pages/ThesisPage";
import CVPage from "./pages/CVPage";
import { CV_PATH, THESIS_PATH } from "./data/profile";

/** New pages start at the top; hash links are handled by the page itself. */
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0 });
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path={THESIS_PATH} element={<ThesisPage />} />
        <Route path="/proyectos" element={<Navigate to="/#projects" replace />} />
        <Route path={CV_PATH} element={<CVPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
