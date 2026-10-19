// Medidas tomadas del plano a mano del local real (Piso1.jpeg, releído con
// la foto rotada para orientarla bien). Entrada en la esquina achaflanada,
// baños sobre la pared del fondo (puertas, no cuartos), escalera también
// sobre la pared del fondo, barra contra la pared opuesta a la entrada (sin
// inclinar). Arriba se mantiene el mismo contorno del edificio: la escalera
// desemboca junto a la pista/DJ (techada) y, cruzándola, el rooftop a cielo
// abierto.
//
// Sistema de coordenadas: X = ancho (0 a 14), Z = profundidad desde la
// entrada hacia el fondo (0 a 10). Un metro de mundo 3D = una unidad. El
// eje X está espejado respecto a cómo se lee la foto: con la cámara fija
// (ver FixedCamera) mirando desde afuera de la entrada hacia adentro, usar
// el mismo X que la foto ponía la entrada a la derecha en vez de a la
// izquierda — se espejó la planta entera para que coincida con la pantalla.

export const FLOORS = { PLANTA_BAJA: "planta-baja", ARRIBA: "arriba" };

// Contorno del edificio (sentido horario, arrancando después del chaflán
// de la entrada). Es el mismo para las dos plantas.
export const BUILDING_OUTLINE = [
  [11, 0],
  [0, 0],
  [0, 10],
  [14, 10],
  [14, 3],
];

// Punto de arranque al cargar la página (siempre planta baja, junto a la
// entrada). Al subir/bajar la escalera, el punto de llegada se calcula
// directamente desde la zona de escalera del piso de destino (ver
// stairsLandingOf), así los dos tramos quedan alineados entre pisos.
export const INITIAL_POSITION = { x: 12, z: 1.8, facing: "up" };

// Puertas de baño: solo decorativas, un panel oscuro con marco empotrado
// en la pared del fondo — "dan a la nada", no son cuartos ni obstáculos.
export const DOORS = {
  [FLOORS.PLANTA_BAJA]: [
    { x: 8.6, z: 10, width: 0.9 },
    { x: 11, z: 10, width: 0.9 },
  ],
  [FLOORS.ARRIBA]: [],
};

// Mobiliario sólido: el avatar no puede atravesarlo.
export const OBSTACLES = {
  [FLOORS.PLANTA_BAJA]: [{ id: "barra-mueble", x: 0.4, z: 1.5, width: 0.9, depth: 4.5 }],
  [FLOORS.ARRIBA]: [{ id: "dj-booth", x: 8, z: 6.5, width: 2.4, depth: 1.2 }],
};

// Zonas interactivas. type "panel" abre el diálogo con el panel
// correspondiente (mismos ids que usan los paneles existentes); type
// "stairs" cambia de planta en vez de abrir un panel.
export const ZONES = {
  [FLOORS.PLANTA_BAJA]: [
    {
      id: "entrada",
      type: "panel",
      label: "Entrada",
      prompt: "Ver bienvenida y horarios",
      x: 10,
      z: 0.3,
      width: 3.6,
      depth: 3.6,
    },
    {
      id: "menu",
      type: "panel",
      label: "Barra",
      prompt: "Ver el menú",
      x: 0.3,
      z: 0.8,
      width: 3.2,
      depth: 5.8,
    },
    {
      id: "escalera-sube",
      type: "stairs",
      label: "Escalera",
      prompt: "Subir al piso de arriba",
      x: 3,
      z: 7,
      width: 2,
      depth: 3,
      target: FLOORS.ARRIBA,
    },
  ],
  [FLOORS.ARRIBA]: [
    {
      id: "escalera-baja",
      type: "stairs",
      label: "Escalera",
      prompt: "Bajar a planta baja",
      x: 3,
      z: 7,
      width: 2,
      depth: 3,
      target: FLOORS.PLANTA_BAJA,
    },
    {
      id: "dj",
      type: "panel",
      label: "Pista / DJ",
      prompt: "Ver la música y el line-up",
      x: 0.5,
      z: 4.5,
      width: 13,
      depth: 5.5,
    },
    {
      id: "rooftop",
      type: "panel",
      label: "Rooftop",
      prompt: "Subir al rooftop",
      x: 0.5,
      z: 0.3,
      width: 13,
      depth: 4,
    },
  ],
};

// Lista plana de las 4 zonas "panel" (las que abren un diálogo), sin
// importar en qué planta están — la usan el acceso directo accesible y el
// título del diálogo en ExploreSection.
export const PANEL_ZONES = [...ZONES[FLOORS.PLANTA_BAJA], ...ZONES[FLOORS.ARRIBA]].filter(
  (zone) => zone.type === "panel"
);

function pointInRect(x, z, rect) {
  return x >= rect.x && x <= rect.x + rect.width && z >= rect.z && z <= rect.z + rect.depth;
}

export function findZoneAt(floorId, x, z) {
  return ZONES[floorId].find((zone) => pointInRect(x, z, zone));
}

export function zoneCenter(zone) {
  return { x: zone.x + zone.width / 2, z: zone.z + zone.depth / 2 };
}

// Dónde aparece el avatar al subir/bajar: el centro de la escalera del
// piso de destino, para que los dos tramos queden alineados.
export function stairsLandingOf(floorId) {
  const stairs = ZONES[floorId].find((zone) => zone.type === "stairs");
  return zoneCenter(stairs);
}

// Colisión simple contra cajas alineadas a los ejes.
export function collidesWithObstacle(floorId, x, z, margin = 0.4) {
  return OBSTACLES[floorId].some((obstacle) => {
    const halfW = obstacle.width / 2 + margin;
    const halfD = obstacle.depth / 2 + margin;
    return Math.abs(x - obstacle.x - obstacle.width / 2) < halfW && Math.abs(z - obstacle.z - obstacle.depth / 2) < halfD;
  });
}
