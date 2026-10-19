import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { useVenueMovement } from "./useVenueMovement.js";
import VenueScene from "./VenueScene.jsx";
import { FLOORS, ZONES } from "./floorPlan.js";
import "./VenueMap.css";

// Objeto estable (fuera del componente): si se pasara un literal nuevo en
// cada render, react-three-fiber reaplicaría esta posición en cada uno de
// los ~60 renders/segundo que dispara el movimiento. Diagonal arriba de la
// entrada, mirando hacia el centro/fondo del local — fija, no sigue al
// avatar (ver FixedCamera).
const INITIAL_CAMERA = { fov: 55, position: [20, 10, -6] };

// Mapa 3D del local: Canvas de react-three-fiber + controles (teclado,
// D-pad táctil) + texto de ayuda. Expone el mismo contrato que usa
// ExploreSection: onEnterPanel(zoneId) para las zonas con panel, y paused
// para congelar el movimiento mientras hay un diálogo abierto.
function VenueMap({ onEnterPanel, paused }) {
  const { state, press, release, teleportTo } = useVenueMovement(onEnterPanel, paused);
  const promptRef = useRef(null);

  const handlePress = (direction) => () => press(direction);
  const handleRelease = (direction) => () => release(direction);

  const activeZone = ZONES[state.floor].find((zone) => zone.id === state.nearZoneId) ?? null;

  return (
    <div className="venue-map">
      <div className="venue-map__canvas-wrap" aria-hidden="true">
        <Canvas shadows camera={INITIAL_CAMERA}>
          <VenueScene
            floor={state.floor}
            x={state.x}
            z={state.z}
            facing={state.facing}
            nearZoneId={state.nearZoneId}
            onSelectZone={teleportTo}
            promptRef={promptRef}
          />
        </Canvas>

        <button
          ref={promptRef}
          type="button"
          className="venue-map__prompt-overlay"
          style={{ display: "none" }}
          onClick={() => activeZone && teleportTo(activeZone)}
        >
          ⏎ {activeZone?.prompt}
        </button>
      </div>

      <p className="venue-map__hint">
        Movete con las flechas o <kbd>WASD</kbd>. Entrá a una zona y presioná <kbd>Enter</kbd> (o tocá el
        cartel). {state.floor === FLOORS.ARRIBA ? "Estás arriba, en la pista." : "Estás en planta baja."}
      </p>

      <div className="venue-map__dpad" aria-hidden="true">
        <button
          type="button"
          className="venue-map__dpad-btn venue-map__dpad-btn--up"
          onPointerDown={handlePress("up")}
          onPointerUp={handleRelease("up")}
          onPointerLeave={handleRelease("up")}
          tabIndex={-1}
        >
          ↑
        </button>
        <div className="venue-map__dpad-row">
          <button
            type="button"
            className="venue-map__dpad-btn"
            onPointerDown={handlePress("left")}
            onPointerUp={handleRelease("left")}
            onPointerLeave={handleRelease("left")}
            tabIndex={-1}
          >
            ←
          </button>
          <button
            type="button"
            className="venue-map__dpad-btn"
            onPointerDown={handlePress("down")}
            onPointerUp={handleRelease("down")}
            onPointerLeave={handleRelease("down")}
            tabIndex={-1}
          >
            ↓
          </button>
          <button
            type="button"
            className="venue-map__dpad-btn"
            onPointerDown={handlePress("right")}
            onPointerUp={handleRelease("right")}
            onPointerLeave={handleRelease("right")}
            tabIndex={-1}
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}

export default VenueMap;
