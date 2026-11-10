// Datos del local para el mapa y el "cómo llegar". ATENCIÓN: la ubicación es
// de ejemplo (un punto en Palermo, CABA). Reemplazá dirección y coordenadas
// por las reales; el mapa y los links se actualizan solos.
export const VENUE = {
  nombre: "Downtempo Rooftop Bar",
  direccion: "Palermo, Ciudad de Buenos Aires",
  lat: -34.5889,
  lon: -58.4306,
};

const DELTA = 0.006;

export function mapaEmbedUrl({ lat, lon } = VENUE) {
  const bbox = [lon - DELTA, lat - DELTA, lon + DELTA, lat + DELTA].join(",");
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;
}

export function mapaLinkUrl({ lat, lon } = VENUE) {
  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=16/${lat}/${lon}`;
}
