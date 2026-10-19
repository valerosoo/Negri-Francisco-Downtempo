import { Suspense, lazy, useCallback, useState } from "react";
import SectionHeading from "../ui/SectionHeading.jsx";
import Spinner from "../ui/Spinner.jsx";
import { PANEL_ZONES } from "./map/floorPlan.js";
import ExplorePanelDialog from "./ExplorePanelDialog.jsx";
import EntradaPanel from "./panels/EntradaPanel.jsx";
import MenuPanel from "./panels/MenuPanel.jsx";
import RooftopPanel from "./panels/RooftopPanel.jsx";
import DJPanel from "./panels/DJPanel.jsx";
import "./ExploreSection.css";

// three.js + react-three-fiber pesan ~1MB: se cargan recién cuando esta
// sección entra en pantalla, no de entrada junto con el resto del sitio.
const VenueMap = lazy(() => import("./map/VenueMap.jsx"));

const PANELS = {
  entrada: EntradaPanel,
  menu: MenuPanel,
  rooftop: RooftopPanel,
  dj: DJPanel,
};

function ExploreSection() {
  const [activeZoneId, setActiveZoneId] = useState(null);

  const openZone = useCallback((zoneId) => setActiveZoneId(zoneId), []);
  const closeDialog = useCallback(() => setActiveZoneId(null), []);

  const activeZone = PANEL_ZONES.find((zone) => zone.id === activeZoneId);
  const ActivePanel = activeZone ? PANELS[activeZone.id] : null;

  return (
    <section className="explore section" id="explora" aria-labelledby="explora-heading">
      <div className="container">
        <SectionHeading id="explora-heading" lead="Explorá" highlight="Downtempo" />
        <p className="explore__intro">
          Recorré el local: caminá hasta la barra para ver el menú, metete en la pista para
          escuchar a los DJs o subí al rooftop.
        </p>

        <Suspense fallback={<Spinner label="Cargando el mapa 3D…" />}>
          <VenueMap onEnterPanel={openZone} paused={Boolean(activeZoneId)} />
        </Suspense>

        <nav className="explore__shortcuts" aria-label="Acceso directo a las secciones de Downtempo">
          <span className="explore__shortcuts-label">Acceso directo:</span>
          {PANEL_ZONES.map((zone) => (
            <button key={zone.id} type="button" className="explore__shortcut" onClick={() => openZone(zone.id)}>
              {zone.label}
            </button>
          ))}
        </nav>

        <ExplorePanelDialog open={Boolean(activeZone)} title={activeZone?.label} onClose={closeDialog}>
          {ActivePanel && <ActivePanel />}
        </ExplorePanelDialog>
      </div>
    </section>
  );
}

export default ExploreSection;
