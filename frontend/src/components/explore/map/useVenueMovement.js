import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  BUILDING_OUTLINE,
  FLOORS,
  INITIAL_POSITION,
  collidesWithObstacle,
  findZoneAt,
  stairsLandingOf,
} from "./floorPlan.js";

const STEP = 0.07;

const KEY_TO_DIRECTION = {
  ArrowUp: "up",
  w: "up",
  W: "up",
  ArrowDown: "down",
  s: "down",
  S: "down",
  ArrowLeft: "left",
  a: "left",
  A: "left",
  ArrowRight: "right",
  d: "right",
  D: "right",
};

const FOCUSABLE_TAGS = new Set(["INPUT", "TEXTAREA", "SELECT", "BUTTON", "A"]);

function hasOwnKeyboardHandling(target) {
  return FOCUSABLE_TAGS.has(target?.tagName) || target?.isContentEditable;
}

// Ray casting estándar: ¿el punto (x,z) está dentro del polígono del
// edificio? Sirve para que el avatar no atraviese paredes, incluida la
// esquina achaflanada de la entrada.
function pointInPolygon(x, z, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, zi] = polygon[i];
    const [xj, zj] = polygon[j];
    const intersects = zi > z !== zj > z && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
}

function isWalkable(floorId, x, z) {
  return pointInPolygon(x, z, BUILDING_OUTLINE) && !collidesWithObstacle(floorId, x, z);
}

// Mueve intentando primero en diagonal; si choca, desliza por un solo eje
// en vez de frenar en seco contra la pared.
function tryMove(floorId, x, z, dx, dz) {
  if (isWalkable(floorId, x + dx, z + dz)) return { x: x + dx, z: z + dz };
  if (isWalkable(floorId, x + dx, z)) return { x: x + dx, z };
  if (isWalkable(floorId, x, z + dz)) return { x, z: z + dz };
  return { x, z };
}

// Hook con toda la lógica del "juego": posición, colisión, detección de
// zona activa y cambio de planta por la escalera. No sabe nada de Three.js
// — VenueMap/VenueScene solo leen el estado que devuelve y lo dibujan.
export function useVenueMovement(onEnterPanel, paused) {
  const [state, setState] = useState({
    floor: FLOORS.PLANTA_BAJA,
    x: INITIAL_POSITION.x,
    z: INITIAL_POSITION.z,
    facing: INITIAL_POSITION.facing,
    nearZoneId: null,
  });

  const stateRef = useRef(state);
  const pausedRef = useRef(false);
  const keysDown = useRef(new Set());

  useLayoutEffect(() => {
    stateRef.current = state;
  });

  useLayoutEffect(() => {
    pausedRef.current = paused;
    if (paused) keysDown.current.clear();
  }, [paused]);

  function goThroughStairs(zone) {
    const landing = stairsLandingOf(zone.target);
    setState((prev) => ({
      ...prev,
      floor: zone.target,
      x: landing.x,
      z: landing.z,
      nearZoneId: null,
    }));
  }

  function interactWithNearZone() {
    const { floor, nearZoneId } = stateRef.current;
    if (!nearZoneId) return;

    const zone = findZoneAt(floor, stateRef.current.x, stateRef.current.z);
    if (!zone) return;

    if (zone.type === "stairs") {
      goThroughStairs(zone);
    } else {
      onEnterPanel(zone.id);
    }
  }

  useEffect(() => {
    let rafId;

    function step() {
      if (!pausedRef.current && keysDown.current.size > 0) {
        setState((prev) => {
          let dx = 0;
          let dz = 0;
          let facing = prev.facing;

          // "up"/W aleja de la cámara (hacia adentro del local, +Z);
          // "down"/S acerca a la cámara (hacia la entrada, -Z).
          if (keysDown.current.has("up")) {
            dz += STEP;
            facing = "up";
          }
          if (keysDown.current.has("down")) {
            dz -= STEP;
            facing = "down";
          }
          // Con la cámara fija diagonal, la pantalla "derecha" cae del
          // lado de -X (ver FixedCamera) — por eso "right"/D resta en vez
          // de sumar.
          if (keysDown.current.has("left")) {
            dx += STEP;
            facing = "left";
          }
          if (keysDown.current.has("right")) {
            dx -= STEP;
            facing = "right";
          }

          const moved = tryMove(prev.floor, prev.x, prev.z, dx, dz);
          const zone = findZoneAt(prev.floor, moved.x, moved.z);

          return { ...prev, x: moved.x, z: moved.z, facing, nearZoneId: zone?.id ?? null };
        });
      }

      rafId = requestAnimationFrame(step);
    }

    rafId = requestAnimationFrame(step);

    function handleKeyDown(event) {
      if (pausedRef.current || hasOwnKeyboardHandling(event.target)) return;

      const direction = KEY_TO_DIRECTION[event.key];
      if (direction) {
        keysDown.current.add(direction);
        event.preventDefault();
        return;
      }

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        interactWithNearZone();
      }
    }

    function handleKeyUp(event) {
      const direction = KEY_TO_DIRECTION[event.key];
      if (direction) keysDown.current.delete(direction);
    }

    function handleBlur() {
      keysDown.current.clear();
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
    };
    // onEnterPanel se espera estable (useCallback con deps vacías en quien
    // llama); interactWithNearZone/goThroughStairs solo leen stateRef.current y
    // setState (siempre estables), así que no hace falta re-suscribir nada.
  }, [onEnterPanel]);

  const press = (direction) => keysDown.current.add(direction);
  const release = (direction) => keysDown.current.delete(direction);

  const teleportTo = (zone) => {
    if (zone.type === "stairs") {
      goThroughStairs(zone);
      return;
    }

    setState((prev) => ({ ...prev, x: zone.x + zone.width / 2, z: zone.z + zone.depth / 2, nearZoneId: zone.id }));
    onEnterPanel(zone.id);
  };

  return { state, press, release, teleportTo };
}
