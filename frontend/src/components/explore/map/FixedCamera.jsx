import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

// Punto fijo mirando hacia el centro del local (contorno 14×10). Se usa la
// misma posición y mirada para las dos plantas: comparten el mismo
// contorno, así que encuadran igual sin importar cuál esté montada.
const LOOK_AT = [7, 0, 5];

// Cámara diagonal fija, arriba de la entrada: no sigue al avatar ni rota.
// Se orienta una sola vez al montar (no hace falta useFrame — nunca más
// se mueve).
function FixedCamera() {
  const { camera } = useThree();

  useEffect(() => {
    camera.lookAt(...LOOK_AT);
  }, [camera]);

  return null;
}

export default FixedCamera;
