import { BadRequestError } from "../exceptions/AppError.js";
import { Messages } from "../enums/Messages.js";
import {
    isNonEmptyString,
    isNonNegativeNumber,
    isPositiveInteger,
    isValidDate,
    isValidTime
} from "../utils/validators.js";

export const validateEvento = (req, res, next) => {
    const body = req.body;

    if (!body || typeof body !== "object" || Array.isArray(body)) {
        throw new BadRequestError(Messages.INVALID_DATA);
    }

    const { nombre, fecha, horaInicio, horaFin, capacidadMaxima, precio, idsDJ } = body;

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

    next();
};
