import { BadRequestError } from "../exceptions/AppError.js";
import { Messages } from "../enums/Messages.js";
import { isNonEmptyString, isPlainObject, isPositiveInteger, isValidEmail } from "../utils/validators.js";

export const MAX_ENTRADAS_POR_COMPRA = 6;
export const MAX_UNIDADES_POR_ITEM = 10;

const isLineaDePedido = (linea) => {
    return (
        isPlainObject(linea) &&
        isPositiveInteger(linea.idItem) &&
        isPositiveInteger(linea.cantidad) &&
        linea.cantidad <= MAX_UNIDADES_POR_ITEM
    );
};

export const validateReserva = (req, res, next) => {
    const body = req.body;

    if (!isPlainObject(body)) {
        throw new BadRequestError(Messages.INVALID_DATA);
    }

    const { idEvento, cantidadEntradas, nombre, email, pedido } = body;

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

    if (pedido !== undefined && (!Array.isArray(pedido) || !pedido.every(isLineaDePedido))) {
        throw new BadRequestError(Messages.INVALID_PEDIDO);
    }

    next();
};

// El email viaja por query string: GET /api/reservas?email= y DELETE /api/reservas/:id?email=
export const validateEmailQuery = (req, res, next) => {
    if (!isValidEmail(req.query.email)) {
        throw new BadRequestError(Messages.INVALID_EMAIL);
    }

    next();
};
