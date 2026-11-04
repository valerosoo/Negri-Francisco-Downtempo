import { request } from "./api.js";

// Devuelve los ítems del menú ({ idItem, nombre, descripcion, precio, categoria }).
export function getMenu() {
  return request("/menu");
}
