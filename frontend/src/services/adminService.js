import { del, post, put, request } from "./api.js";

const KEY_STORAGE = "downtempo:admin-key";

// La clave de administrador se guarda solo durante la sesión de la pestaña y
// viaja en el header x-admin-key de cada operación protegida.
export function getAdminKey() {
  try {
    return sessionStorage.getItem(KEY_STORAGE) ?? "";
  } catch {
    return "";
  }
}

let currentKey = getAdminKey();

function setAdminKey(key) {
  try {
    sessionStorage.setItem(KEY_STORAGE, key);
  } catch {
    // Sin storage la sesión dura hasta recargar la página.
  }
}

export function logoutAdmin() {
  currentKey = "";

  try {
    sessionStorage.removeItem(KEY_STORAGE);
  } catch {
    // Nada que limpiar.
  }
}

const auth = () => ({ headers: { "x-admin-key": currentKey } });

// Verifica la clave contra el backend antes de guardarla.
export async function loginAdmin(key) {
  await post("/admin/login", undefined, { headers: { "x-admin-key": key } });
  currentKey = key;
  setAdminKey(key);
}

export const adminApi = {
  // Eventos
  createEvento: (data) => post("/eventos", data, auth()),
  updateEvento: (id, data) => put(`/eventos/${id}`, data, auth()),
  deleteEvento: (id) => del(`/eventos/${id}`, auth()),

  // DJs
  updateDJ: (id, data) => put(`/djs/${id}`, data, auth()),
  deleteDJ: (id) => del(`/djs/${id}`, auth()),

  // Menú
  createItem: (data) => post("/menu", data, auth()),
  updateItem: (id, data) => put(`/menu/${id}`, data, auth()),
  deleteItem: (id) => del(`/menu/${id}`, auth()),

  // Ventas y control de puerta
  getReservas: () => request("/admin/reservas", auth()),
  validarEntrada: (codigo) => post(`/entradas/${encodeURIComponent(codigo)}/validar`, undefined, auth()),
};
