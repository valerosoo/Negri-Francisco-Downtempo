import { post, request } from "./api.js";

const RESOURCE = "/djs";

export function getDJs() {
  return request(RESOURCE);
}

// Alta pública: el formulario "¿Sos DJ?" del sitio.
export function createDJ(data) {
  return post(RESOURCE, data);
}

export function likeDJ(id) {
  return post(`${RESOURCE}/${id}/like`);
}

// Todo lo que muestra la ficha de un DJ, en un solo pedido desde la pantalla:
// sus playlists, DJs parecidos y los temas que le recomendó el público.
export async function getDJDetalle(id) {
  const [playlists, similares, recomendaciones] = await Promise.all([
    request(`${RESOURCE}/${id}/playlists`),
    request(`${RESOURCE}/${id}/similares`),
    request(`${RESOURCE}/${id}/recomendaciones`),
  ]);

  return { playlists, similares, recomendaciones };
}

// { tituloCancion, artista, mensaje?, nombre? }
export function recomendarCancion(id, data) {
  return post(`${RESOURCE}/${id}/recomendaciones`, data);
}
