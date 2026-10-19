import { COLOR } from "./palette.js";

// Parche de piso tintado por zona (más fuerte cuando el avatar está
// adentro). El clic sobre el parche teletransporta y entra, igual que el
// cartel "⏎" (que se dibuja afuera del Canvas, como overlay HTML — ver
// PromptOverlay — para no depender de <Html> de drei, que en esta versión
// de React 19 dispara errores de montaje al usarse varias veces a la vez).
function ZoneVolume({ zone, active, onSelect }) {
  const centerX = zone.x + zone.width / 2;
  const centerZ = zone.z + zone.depth / 2;
  const tint = zone.type === "stairs" ? COLOR.orange : COLOR.lime;

  return (
    <mesh
      position={[centerX, 0.015, centerZ]}
      rotation={[-Math.PI / 2, 0, 0]}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(zone);
      }}
    >
      <planeGeometry args={[zone.width, zone.depth]} />
      <meshBasicMaterial color={tint} transparent opacity={active ? 0.2 : 0.07} />
    </mesh>
  );
}

export default ZoneVolume;
