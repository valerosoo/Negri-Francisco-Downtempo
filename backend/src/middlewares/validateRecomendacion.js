import { BadRequestError } from "../exceptions/AppError.js";
import { Messages } from "../enums/Messages.js";
import { isNonEmptyString, isPlainObject } from "../utils/validators.js";

export const MAX_MENSAJE = 200;

export const validateRecomendacion = (req, res, next) => {
    const body = req.body;

    if (!isPlainObject(body)) {
        throw new BadRequestError(Messages.INVALID_DATA);
    }

    const { tituloCancion, artista, mensaje, nombre } = body;

    if (!isNonEmptyString(tituloCancion)) {
        throw new BadRequestError(Messages.INVALID_TITULO_CANCION);
    }

    if (!isNonEmptyString(artista)) {
        throw new BadRequestError(Messages.INVALID_ARTISTA);
    }

    if (mensaje !== undefined && (typeof mensaje !== "string" || mensaje.length > MAX_MENSAJE)) {
        throw new BadRequestError(Messages.INVALID_MENSAJE);
    }

    if (nombre !== undefined && typeof nombre !== "string") {
        throw new BadRequestError(Messages.INVALID_NOMBRE);
    }

    next();
};
