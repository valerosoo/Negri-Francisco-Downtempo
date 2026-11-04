import { request } from "./api.js";

const RESOURCE = "/eventos";

// Cartelera completa, ordenada por fecha, con los DJs de cada evento ya resueltos.
export function getEventos() {
  return request(RESOURCE);
}

export function getEvento(id) {
  return request(`${RESOURCE}/${id}`);
}
