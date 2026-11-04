import { useCallback, useMemo, useState } from "react";
import Navbar from "../components/layout/Navbar.jsx";
import Footer from "../components/layout/Footer.jsx";
import Hero from "../components/home/Hero.jsx";
import EventsSection from "../components/events/EventsSection.jsx";
import CheckoutDialog from "../components/events/CheckoutDialog.jsx";
import DJSection from "../components/sections/DJSection.jsx";
import MenuSection from "../components/sections/MenuSection.jsx";
import RooftopSection from "../components/sections/RooftopSection.jsx";
import { getEventos } from "../services/eventoService.js";
import { useAsync } from "../utils/useAsync.js";
import { hoyISO } from "../utils/format.js";

// Orden de prioridades de la página: 1) próxima fecha y compra de entradas,
// 2) cartelera completa, 3) los DJs, 4) menú y rooftop como apoyo.
function HomePage() {
  const { data: eventos, loading, error, reload } = useAsync(getEventos, []);
  const [comprando, setComprando] = useState(null);

  // La cartelera solo muestra fechas que todavía no pasaron.
  const proximos = useMemo(() => (eventos ?? []).filter((evento) => evento.fecha >= hoyISO()), [eventos]);
  const destacado = proximos.find((evento) => evento.entradasDisponibles > 0) ?? proximos[0];

  const cerrarCompra = useCallback(() => setComprando(null), []);

  return (
    <>
      <a href="#main-content" className="skip-link">
        Saltar al contenido principal
      </a>
      <Navbar />
      <main id="main-content">
        <Hero evento={destacado} loading={loading} error={error} onComprar={setComprando} />
        <EventsSection
          eventos={proximos}
          loading={loading}
          error={error}
          onRetry={reload}
          onComprar={setComprando}
        />
        <DJSection />
        <MenuSection />
        <RooftopSection />
      </main>
      <Footer />

      {comprando && <CheckoutDialog evento={comprando} onClose={cerrarCompra} onPurchased={reload} />}
    </>
  );
}

export default HomePage;
