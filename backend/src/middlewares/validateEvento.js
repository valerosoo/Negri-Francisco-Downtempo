import { BadRequestError } from "../exceptions/AppError.js";
import { Messages } from "../enums/Messages.js";
import {
    isNonEmptyString,
    isNonNegativeNumber,
    isPlainObject,
    isPositiveInteger,
    isPositiveIntegerString,
    isValidDate,
    isValidTime
} from "../utils/validators.js";

export const validateEvento = (req, res, next) => {
    const body = req.body;

    if (!isPlainObject(body)) {
        throw new BadRequestError(Messages.INVALID_DATA);
    }

    const { nombre, fecha, horaInicio, horaFin, capacidadMaxima, precio, idsDJ, descripcion } = body;

    if (!isNonEmptyString(nombre)) {
        throw new BadRequestError(Messages.INVALID_NOMBRE);
    }

    if (!isValidDate(fecha)) {
        throw new BadRequestError(Messages.INVALID_FECHA);
    }

    if (!isValidTime(horaInicio) || !isValidTime(horaFin)) {
        throw new BadRequestError(Messages.INVALID_HORA);
    }

    if (!isPositiveInteger(capacidadMaxima)) {
        throw new BadRequestError(Messages.INVALID_CAPACIDAD);
    }

    if (!isNonNegativeNumber(precio)) {
        throw new BadRequestError(Messages.INVALID_PRECIO);
    }

    if (idsDJ !== undefined && (!Array.isArray(idsDJ) || !idsDJ.every(isPositiveInteger))) {
        throw new BadRequestError(Messages.INVALID_IDS_DJ);
    }

    if (descripcion !== undefined && typeof descripcion !== "string") {
        throw new BadRequestError(Messages.INVALID_DESCRIPCION);
    }

    next();
};

// Filtros de GET /api/eventos: ?genero=&dj=&desde=&hasta=&disponibles=true
export const validateEventoQuery = (req, res, next) => {
    const { dj, desde, hasta } = req.query;

    if (dj !== undefined && !isPositiveIntegerString(dj)) {
        throw new BadRequestError(Messages.INVALID_ID);
    }

    if ((desde !== undefined && !isValidDate(desde)) || (hasta !== undefined && !isValidDate(hasta))) {
        throw new BadRequestError(Messages.INVALID_FILTRO_FECHA);
    }

    next();
};
