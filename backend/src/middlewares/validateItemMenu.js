import { BadRequestError } from "../exceptions/AppError.js";
import { Messages } from "../enums/Messages.js";
import { isNonEmptyString, isNonNegativeNumber, isPlainObject } from "../utils/validators.js";

export const validateItemMenu = (req, res, next) => {
    const body = req.body;

    if (!isPlainObject(body)) {
        throw new BadRequestError(Messages.INVALID_DATA);
    }

    const { nombre, descripcion, precio, categoria } = body;

    if (!isNonEmptyString(nombre)) {
        throw new BadRequestError(Messages.INVALID_NOMBRE);
    }

    if (descripcion !== undefined && typeof descripcion !== "string") {
        throw new BadRequestError(Messages.INVALID_DESCRIPCION);
    }

    if (!isNonNegativeNumber(precio)) {
        throw new BadRequestError(Messages.INVALID_PRECIO);
    }

    if (!isNonEmptyString(categoria)) {
        throw new BadRequestError(Messages.INVALID_CATEGORIA);
    }

    next();
};
