export const Messages = Object.freeze({
    // DJ
    DJ_NOT_FOUND: "El DJ no existe.",
    DJ_DUPLICATED: "Ya existe un DJ con ese nombre.",
    DJ_CREATED: "DJ creado correctamente.",
    DJ_UPDATED: "DJ modificado correctamente.",
    DJ_DELETED: "DJ eliminado correctamente.",

    // Eventos
    EVENTO_NOT_FOUND: "El evento no existe.",
    EVENTO_CREATED: "Evento creado correctamente.",
    EVENTO_UPDATED: "Evento modificado correctamente.",
    EVENTO_DELETED: "Evento eliminado correctamente.",
    EVENTO_CON_RESERVAS: "No se puede eliminar un evento que ya tiene entradas vendidas.",
    EVENTO_CAPACIDAD_INSUFICIENTE: "La capacidad no puede ser menor a las entradas ya vendidas.",
    EVENTO_DJ_NOT_FOUND: "Alguno de los DJs indicados no existe.",

    // Reservas / entradas
    RESERVA_NOT_FOUND: "La reserva no existe.",
    RESERVA_CREATED: "Compra realizada correctamente.",
    EVENTO_PASADO: "Este evento ya pasó, no se pueden comprar entradas.",
    SIN_CUPO: "No hay suficientes entradas disponibles para este evento.",

    // Validaciones
    INVALID_DATA: "Los datos enviados son inválidos.",
    INVALID_ID: "El ID debe ser un número entero positivo.",
    INVALID_NOMBRE: "El nombre es obligatorio y debe ser un texto.",
    INVALID_GENERO_MUSICAL: "El género musical es obligatorio y debe ser un texto.",
    INVALID_BIOGRAFIA: "La biografía debe ser un texto.",
    INVALID_CANTIDAD_LIKES: "La cantidad de likes debe ser un número entero mayor o igual a 0.",

    INVALID_FECHA: "La fecha es obligatoria y debe tener formato AAAA-MM-DD.",
    INVALID_HORA: "Los horarios son obligatorios y deben tener formato HH:MM.",
    INVALID_CAPACIDAD: "La capacidad debe ser un número entero mayor a 0.",
    INVALID_PRECIO: "El precio debe ser un número mayor o igual a 0.",
    INVALID_IDS_DJ: "Los DJs deben ser una lista de IDs enteros positivos.",
    INVALID_ID_EVENTO: "El evento es obligatorio y debe ser un ID entero positivo.",
    INVALID_CANTIDAD_ENTRADAS: "La cantidad de entradas debe ser un número entero entre 1 y 6.",
    INVALID_EMAIL: "El email es obligatorio y debe ser válido.",

    // Generales
    ROUTE_NOT_FOUND: "La ruta solicitada no existe.",
    INVALID_JSON: "El cuerpo de la petición no es un JSON válido.",
    INTERNAL_SERVER_ERROR: "Ocurrió un error interno en el servidor."
});
