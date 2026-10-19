export const Messages = Object.freeze({
    // DJ
    DJ_NOT_FOUND: "El DJ no existe.",
    DJ_DUPLICATED: "Ya existe un DJ con ese nombre.",
    DJ_CREATED: "DJ creado correctamente.",
    DJ_UPDATED: "DJ modificado correctamente.",
    DJ_DELETED: "DJ eliminado correctamente.",

    // Validaciones
    INVALID_DATA: "Los datos enviados son inválidos.",
    INVALID_ID: "El ID debe ser un número entero positivo.",
    INVALID_NOMBRE: "El nombre es obligatorio y debe ser un texto.",
    INVALID_GENERO_MUSICAL: "El género musical es obligatorio y debe ser un texto.",
    INVALID_BIOGRAFIA: "La biografía debe ser un texto.",
    INVALID_CANTIDAD_LIKES: "La cantidad de likes debe ser un número entero mayor o igual a 0.",

    // Generales
    ROUTE_NOT_FOUND: "La ruta solicitada no existe.",
    INVALID_JSON: "El cuerpo de la petición no es un JSON válido.",
    INTERNAL_SERVER_ERROR: "Ocurrió un error interno en el servidor."
});
