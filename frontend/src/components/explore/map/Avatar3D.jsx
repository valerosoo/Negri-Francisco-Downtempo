import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { COLOR } from "./palette.js";

// "up" = moviéndose hacia +Z, alejándose de la entrada; "left" ahora es
// +X y "right" es -X (ver useVenueMovement). La nariz naranja apunta por
// defecto hacia +Z, así que solo roto el resto de los casos relativo a eso.
const ROTATION_FOR_FACING = { up: 0, left: Math.PI / 2, down: Math.PI, right: -Math.PI / 2 };

function shortestAngleDiff(target, current) {
  return Math.atan2(Math.sin(target - current), Math.cos(target - current));
}

// Suaviza posición/rotación entre los saltos de estado de React (que ya
// vienen a ~60fps, pero interpolar acá evita cualquier salto visible).
function Avatar3D({ x, z, facing }) {
  const groupRef = useRef(null);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const ease = Math.min(1, delta * 12);
    group.position.x += (x - group.position.x) * ease;
    group.position.z += (z - group.position.z) * ease;

    const targetRotation = ROTATION_FOR_FACING[facing];
    group.rotation.y += shortestAngleDiff(targetRotation, group.rotation.y) * ease;
  });

  return (
    <group ref={groupRef} position={[x, 0, z]}>
      <mesh position={[0, 0.45, 0]} castShadow>
        <sphereGeometry args={[0.32, 20, 16]} />
        <meshStandardMaterial color={COLOR.lime} emissive={COLOR.lime} emissiveIntensity={0.25} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.45, 0.34]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.12, 0.3, 10]} />
        <meshStandardMaterial color={COLOR.orange} emissive={COLOR.orange} emissiveIntensity={0.6} toneMapped={false} />
      </mesh>
      <pointLight position={[0, 1, 0]} color={COLOR.lime} intensity={0.8} distance={3.5} />
    </group>
  );
}

export default Avatar3D;
