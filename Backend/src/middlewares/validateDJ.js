import { BadRequestError } from "../exceptions/AppError.js";
import { Messages } from "../enums/Messages.js";
import { isNonEmptyString, isNonNegativeInteger } from "../utils/validators.js";

export const validateDJ = (req, res, next) => {
    const body = req.body;

    if (!body || typeof body !== "object" || Array.isArray(body)) {
        throw new BadRequestError(Messages.INVALID_DATA);
    }

    const { nombre, generoMusical, biografia, cantidadLikes } = body;

    if (!isNonEmptyString(nombre)) {
        throw new BadRequestError(Messages.INVALID_NOMBRE);
    }

    if (!isNonEmptyString(generoMusical)) {
        throw new BadRequestError(Messages.INVALID_GENERO_MUSICAL);
    }

    if (biografia !== undefined && typeof biografia !== "string") {
        throw new BadRequestError(Messages.INVALID_BIOGRAFIA);
    }

    if (cantidadLikes !== undefined && !isNonNegativeInteger(cantidadLikes)) {
        throw new BadRequestError(Messages.INVALID_CANTIDAD_LIKES);
    }

    next();
};
