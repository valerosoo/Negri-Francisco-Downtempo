import { Stars } from "@react-three/drei";
import RoomGeometry from "./RoomGeometry.jsx";
import Staircase from "./Staircase.jsx";
import ZoneVolume from "./ZoneVolume.jsx";
import Avatar3D from "./Avatar3D.jsx";
import FixedCamera from "./FixedCamera.jsx";
import PromptProjector from "./PromptProjector.jsx";
import { FLOORS, ZONES } from "./floorPlan.js";
import { COLOR } from "./palette.js";

// Contenido de la escena (todo lo que va DENTRO de <Canvas>). Sin techo, el
// local queda a cielo abierto en las dos plantas, así que las estrellas se
// ven siempre por arriba de las paredes.
function VenueScene({ floor, x, z, facing, nearZoneId, onSelectZone, promptRef }) {
  const zones = ZONES[floor];
  const activeZone = zones.find((zone) => zone.id === nearZoneId) ?? null;

  return (
    <>
      <color attach="background" args={[COLOR.void]} />
      <fog attach="fog" args={[COLOR.void, 14, 34]} />

      {/* three.js calcula la luz con caída físicamente correcta (1/distancia²):
          valores "intuitivos" de intensidad quedan casi negros. La ambiental +
          hemisférica garantizan que se vea algo aunque las puntuales fallen. */}
      <ambientLight intensity={1.4} />
      <hemisphereLight args={[COLOR.text, COLOR.void, 1.2]} />
      <directionalLight position={[6, 10, 4]} intensity={2} />
      <pointLight position={[2.5, 2.4, 5]} color={COLOR.orange} intensity={28} distance={10} decay={2} />
      <pointLight position={[6.5, 2.4, 7.5]} color={COLOR.lime} intensity={24} distance={10} decay={2} />

      <Stars radius={60} depth={30} count={1200} factor={2.4} fade speed={0.4} />

      <RoomGeometry floorId={floor} />
      {floor === FLOORS.PLANTA_BAJA && <Staircase />}

      {zones.map((zone) => (
        <ZoneVolume key={zone.id} zone={zone} active={zone.id === nearZoneId} onSelect={onSelectZone} />
      ))}

      <Avatar3D x={x} z={z} facing={facing} />
      <FixedCamera />
      <PromptProjector zone={activeZone} elementRef={promptRef} />
    </>
  );
}

export default VenueScene;
