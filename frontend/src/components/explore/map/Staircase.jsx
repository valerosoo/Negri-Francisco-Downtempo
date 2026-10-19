import { FLOORS, ZONES } from "./floorPlan.js";
import { COLOR } from "./palette.js";

const STEPS = 6;
const TOTAL_RISE = 2.7; // se queda un poco por debajo del techo (3m)

// Tramo de escalones visibles en planta baja, subiendo hacia el fondo. En
// "arriba" no hace falta geometría extra: el piso ya cubre ese rectángulo
// y la zona de "bajar" sigue funcionando igual.
function Staircase() {
  const zone = ZONES[FLOORS.PLANTA_BAJA].find((item) => item.type === "stairs");
  const stepDepth = zone.depth / STEPS;
  const stepRise = TOTAL_RISE / STEPS;
  const centerX = zone.x + zone.width / 2;

  return (
    <group>
      {Array.from({ length: STEPS }).map((_, index) => (
        <mesh
          key={index}
          position={[centerX, stepRise * index + stepRise / 2, zone.z + stepDepth * index + stepDepth / 2]}
        >
          <boxGeometry args={[zone.width, stepRise, stepDepth]} />
          <meshStandardMaterial color={COLOR.surfaceRaised} roughness={0.6} />
        </mesh>
      ))}

      {[zone.x, zone.x + zone.width].map((railX) => (
        <mesh key={railX} position={[railX, 1.1, zone.z + zone.depth / 2]}>
          <boxGeometry args={[0.06, 0.9, zone.depth]} />
          <meshStandardMaterial color={COLOR.lime} emissive={COLOR.lime} emissiveIntensity={0.35} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

export default Staircase;
