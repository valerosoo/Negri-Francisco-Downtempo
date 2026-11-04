import { BadRequestError } from "../exceptions/AppError.js";
import { Messages } from "../enums/Messages.js";
import { isNonEmptyString, isPositiveInteger, isValidEmail } from "../utils/validators.js";

export const MAX_ENTRADAS_POR_COMPRA = 6;

export const validateReserva = (req, res, next) => {
    const body = req.body;

    if (!body || typeof body !== "object" || Array.isArray(body)) {
        throw new BadRequestError(Messages.INVALID_DATA);
    }

    const { idEvento, cantidadEntradas, nombre, email } = body;

    if (!isPositiveInteger(idEvento)) {
        throw new BadRequestError(Messages.INVALID_ID_EVENTO);
    }

    if (!isPositiveInteger(cantidadEntradas) || cantidadEntradas > MAX_ENTRADAS_POR_COMPRA) {
        throw new BadRequestError(Messages.INVALID_CANTIDAD_ENTRADAS);
    }

    if (!isNonEmptyString(nombre)) {
        throw new BadRequestError(Messages.INVALID_NOMBRE);
    }

    if (!isValidEmail(email)) {
        throw new BadRequestError(Messages.INVALID_EMAIL);
    }

    next();
};
