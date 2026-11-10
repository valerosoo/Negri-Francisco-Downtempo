export const Messages = Object.freeze({
    // DJ
    DJ_NOT_FOUND: "El DJ no existe.",
    DJ_DUPLICATED: "Ya existe un DJ con ese nombre.",
    DJ_CREATED: "DJ creado correctamente.",
    DJ_UPDATED: "DJ modificado correctamente.",
    DJ_DELETED: "DJ eliminado correctamente.",
    DJ_LIKED: "Like registrado.",
    DJ_CON_EVENTOS: "No se puede eliminar un DJ que está en el line-up de una fecha próxima.",

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
    RESERVA_CANCELADA: "Reserva cancelada. Las entradas volvieron a estar disponibles.",
    RESERVA_YA_CANCELADA: "La reserva ya estaba cancelada.",
    RESERVA_EMAIL_NO_COINCIDE: "El email no coincide con el de la reserva.",
    RESERVA_NO_CANCELABLE_PASADA: "No se puede cancelar una reserva de un evento que ya pasó.",
    RESERVA_NO_CANCELABLE_USADA: "No se puede cancelar una reserva con entradas ya usadas.",
    EVENTO_PASADO: "Este evento ya pasó, no se pueden comprar entradas.",
    SIN_CUPO: "No hay suficientes entradas disponibles para este evento.",
    ENTRADA_NOT_FOUND: "No existe ninguna entrada con ese código.",
    ENTRADA_VALIDADA: "Entrada válida. ¡Que pase!",
    ENTRADA_YA_USADA: "Esta entrada ya fue usada.",
    ENTRADA_CANCELADA: "Esta entrada pertenece a una reserva cancelada.",

    // Menú
    ITEM_NOT_FOUND: "El ítem del menú no existe.",
    ITEM_DUPLICATED: "Ya existe un ítem con ese nombre en el menú.",
    ITEM_CREATED: "Ítem agregado al menú.",
    ITEM_UPDATED: "Ítem modificado correctamente.",
    ITEM_DELETED: "Ítem eliminado del menú.",
    PEDIDO_ITEM_NOT_FOUND: "Alguno de los ítems del pedido no existe en el menú.",

    // Recomendaciones
    RECOMENDACION_CREATED: "¡Gracias! Le pasamos tu recomendación al DJ.",

    // Admin
    ADMIN_OK: "Acceso concedido.",
    UNAUTHORIZED: "Clave de administrador incorrecta o ausente.",

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
    INVALID_DESCRIPCION: "La descripción debe ser un texto.",
    INVALID_ID_EVENTO: "El evento es obligatorio y debe ser un ID entero positivo.",
    INVALID_CANTIDAD_ENTRADAS: "La cantidad de entradas debe ser un número entero entre 1 y 6.",
    INVALID_EMAIL: "El email es obligatorio y debe ser válido.",
    INVALID_PEDIDO: "El pedido debe ser una lista de { idItem, cantidad } con cantidades entre 1 y 10.",
    INVALID_CATEGORIA: "La categoría es obligatoria y debe ser un texto.",
    INVALID_TITULO_CANCION: "El título de la canción es obligatorio.",
    INVALID_ARTISTA: "El artista es obligatorio.",
    INVALID_MENSAJE: "El mensaje debe ser un texto de hasta 200 caracteres.",
    INVALID_FILTRO_FECHA: "Los filtros de fecha deben tener formato AAAA-MM-DD.",

    // Generales
    ROUTE_NOT_FOUND: "La ruta solicitada no existe.",
    INVALID_JSON: "El cuerpo de la petición no es un JSON válido.",
    INTERNAL_SERVER_ERROR: "Ocurrió un error interno en el servidor."
});
