const API_BASE_URL = "http://localhost:3000/api";

// Wrapper único de fetch: arma la URL, fija los headers, interpreta la
// respuesta { success, data, message } del backend y lanza un Error con el
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
    throw new Error("No se pudo conectar con el servidor. Verificá que el backend esté corriendo.");
  }

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(body?.message || "Ocurrió un error inesperado en el servidor.");
  }

  return body?.data;
}
