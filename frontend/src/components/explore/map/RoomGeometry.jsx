import * as THREE from "three";
import { useMemo } from "react";
import { BUILDING_OUTLINE, DOORS, OBSTACLES } from "./floorPlan.js";
import { COLOR } from "./palette.js";

const WALL_HEIGHT = 3;
const WALL_THICKNESS = 0.15;

function buildWalls(outline) {
  return outline.map((point, index) => {
    const [ax, az] = point;
    const [bx, bz] = outline[(index + 1) % outline.length];
    const dx = bx - ax;
    const dz = bz - az;

    return {
      length: Math.hypot(dx, dz),
      midX: (ax + bx) / 2,
      midZ: (az + bz) / 2,
      rotationY: Math.atan2(dz, dx),
    };
  });
}

// ShapeGeometry vive en el plano local XY; el mesh la acuesta con
// rotation=[-π/2,0,0] para que quede plana en el piso. Esa rotación manda
// la Y local a mundo-Z con el signo invertido (mundoZ = -localY), así que
// hay que pasar -z al construir el shape para que el piso quede alineado
// con las paredes (que se ubican con las coordenadas del outline tal
// cual). Sin este signo, el piso aparecía espejado del otro lado del eje Z.
function buildFloorShape(outline) {
  const shape = new THREE.Shape();
  outline.forEach(([x, z], index) => {
    if (index === 0) shape.moveTo(x, -z);
    else shape.lineTo(x, -z);
  });
  shape.closePath();
  return shape;
}

function Obstacle({ obstacle }) {
  const { id, x, z, width, depth, rotation = 0 } = obstacle;
  const isCounter = id.includes("barra");
  const isBooth = id.includes("dj");
  const height = isCounter ? 1.05 : isBooth ? 0.9 : 2.3;
  const accent = isCounter ? COLOR.orange : isBooth ? COLOR.lime : null;

  return (
    <group position={[x + width / 2, 0, z + depth / 2]} rotation={[0, rotation, 0]}>
      <mesh position={[0, height / 2, 0]} castShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={COLOR.surfaceRaised} roughness={0.7} />
      </mesh>
      {accent && (
        <mesh position={[0, height + 0.02, 0]}>
          <boxGeometry args={[width, 0.04, depth]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.5} toneMapped={false} />
        </mesh>
      )}
    </group>
  );
}

const DOOR_HEIGHT = 2.2;
const FRAME_THICKNESS = 0.08;

// Puerta de baño: solo un marco con un panel oscuro adentro, empotrada en
// la pared del fondo (z fijo) — "da a la nada", no es un cuarto ni un
// obstáculo con el que choque el avatar.
function Door({ x, z, width }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, DOOR_HEIGHT / 2, 0]}>
        <planeGeometry args={[width, DOOR_HEIGHT]} />
        <meshStandardMaterial color={COLOR.void} roughness={1} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[-width / 2, DOOR_HEIGHT / 2, 0]}>
        <boxGeometry args={[FRAME_THICKNESS, DOOR_HEIGHT, 0.08]} />
        <meshStandardMaterial color={COLOR.text} roughness={0.4} />
      </mesh>
      <mesh position={[width / 2, DOOR_HEIGHT / 2, 0]}>
        <boxGeometry args={[FRAME_THICKNESS, DOOR_HEIGHT, 0.08]} />
        <meshStandardMaterial color={COLOR.text} roughness={0.4} />
      </mesh>
      <mesh position={[0, DOOR_HEIGHT, 0]}>
        <boxGeometry args={[width + FRAME_THICKNESS, FRAME_THICKNESS, 0.08]} />
        <meshStandardMaterial color={COLOR.text} roughness={0.4} />
      </mesh>
    </group>
  );
}

// Dibuja el edificio (piso, paredes y mobiliario sólido) a partir de los
// datos de floorPlan.js. Las dos plantas comparten el mismo contorno; lo
// que cambia es el mobiliario. Sin techo a propósito: con la cámara fija
// de arriba, se necesita ver el interior completo.
function RoomGeometry({ floorId }) {
  const walls = useMemo(() => buildWalls(BUILDING_OUTLINE), []);
  const floorShape = useMemo(() => buildFloorShape(BUILDING_OUTLINE), []);
  const obstacles = OBSTACLES[floorId] ?? [];
  const doors = DOORS[floorId] ?? [];

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <shapeGeometry args={[floorShape]} />
        {/* DoubleSide como red de seguridad: si el sentido del polígono
            terminara apuntando la normal "para abajo", igual se ve desde
            arriba. */}
        <meshStandardMaterial color={COLOR.surfaceRaised} roughness={0.85} side={THREE.DoubleSide} />
      </mesh>

      {walls.map((wall, index) => (
        <mesh key={index} position={[wall.midX, WALL_HEIGHT / 2, wall.midZ]} rotation={[0, wall.rotationY, 0]}>
          <boxGeometry args={[wall.length, WALL_HEIGHT, WALL_THICKNESS]} />
          <meshStandardMaterial color={COLOR.border} roughness={0.85} />
        </mesh>
      ))}

      {obstacles.map((obstacle) => (
        <Obstacle key={obstacle.id} obstacle={obstacle} />
      ))}

      {doors.map((door, index) => (
        <Door key={index} {...door} />
      ))}
    </group>
  );
}

export default RoomGeometry;
