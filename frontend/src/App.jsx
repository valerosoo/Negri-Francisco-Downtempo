import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { ToastProvider } from "./context/ToastContext.jsx";
import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";
import HomePage from "./pages/HomePage.jsx";
import EventoPage from "./pages/EventoPage.jsx";
import MisEntradasPage from "./pages/MisEntradasPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

// Al cambiar de pantalla: si la URL trae un ancla (/#djs) se baja hasta esa
// sección; si no, se vuelve arriba. location.key cambia en cada navegación,
// así también funciona al tocar dos veces el mismo link.
function ScrollManager() {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;

    if (target) {
      target.scrollIntoView();
    } else if (!hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash, key]);

  return null;
}

// App.jsx organiza la aplicación: notificaciones globales, router y el marco
// común (navbar + pie) alrededor de cada página.
function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <ScrollManager />
        <a href="#main-content" className="skip-link">
          Saltar al contenido principal
        </a>
        <Navbar />
        <main id="main-content" tabIndex={-1}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/eventos/:id" element={<EventoPage />} />
            <Route path="/mis-entradas" element={<MisEntradasPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
