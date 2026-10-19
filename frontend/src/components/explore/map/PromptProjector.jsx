import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const WORLD_HEIGHT = 2.1;
const projected = new THREE.Vector3();

// Corre dentro del <Canvas>: cada frame calcula dónde cae en pantalla el
// punto 3D de la zona activa y mueve el nodo DOM del cartel directamente
// por ref (sin pasar por React). Reemplaza a <Html> de drei, que con esta
// versión de React 19 dispara errores de montaje al usarse más de una vez
// a la vez (ver las 3 zonas de planta baja).
function PromptProjector({ zone, elementRef }) {
  const { camera, size } = useThree();

  useFrame(() => {
    const node = elementRef.current;
    if (!node) return;

    if (!zone) {
      node.style.display = "none";
      return;
    }

    const centerX = zone.x + zone.width / 2;
    const centerZ = zone.z + zone.depth / 2;

    projected.set(centerX, WORLD_HEIGHT, centerZ).project(camera);

    if (projected.z > 1) {
      node.style.display = "none";
      return;
    }

    const screenX = (projected.x * 0.5 + 0.5) * size.width;
    const screenY = (-projected.y * 0.5 + 0.5) * size.height;

    node.style.display = "block";
    node.style.transform = `translate(-50%, -100%) translate(${screenX}px, ${screenY}px)`;
  });

  return null;
}

export default PromptProjector;
