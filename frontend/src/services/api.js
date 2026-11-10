// La URL base sale de VITE_API_URL (ver frontend/.env.example); si no está
// definida se usa el backend local.
const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

// Error de la API con el código HTTP, para poder distinguir casos (401, 404…).
export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// Wrapper único de fetch: arma la URL, fija los headers, interpreta la
// respuesta { success, data, message } del backend y lanza un ApiError con el
// mensaje del servidor cuando la operación falla. Todos los servicios
// (djService, etc.) pasan por acá en vez de repetir fetch en cada lugar.
export async function request(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
  } catch {
    throw new ApiError("No se pudo conectar con el servidor. Verificá que el backend esté corriendo.", 0);
  }

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(body?.message || "Ocurrió un error inesperado en el servidor.", response.status);
  }

  return body?.data;
}

export function post(path, data, options = {}) {
  return request(path, { ...options, method: "POST", body: data === undefined ? undefined : JSON.stringify(data) });
}

export function put(path, data, options = {}) {
  return request(path, { ...options, method: "PUT", body: JSON.stringify(data) });
}

export function del(path, options = {}) {
  return request(path, { ...options, method: "DELETE" });
}
