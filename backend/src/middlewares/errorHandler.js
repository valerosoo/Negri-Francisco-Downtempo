import AppError from "../exceptions/AppError.js";
import { errorResponse } from "../responses/ApiResponse.js";
import { HttpStatus } from "../enums/HttpStatus.js";
import { Messages } from "../enums/Messages.js";

// Middleware centralizado de manejo de errores
export const errorHandler = (err, req, res, next) => {
    if (err instanceof AppError) {
        return errorResponse(res, err.message, err.statusCode);
    }

    // JSON mal formado enviado en el body
    if (err.type === "entity.parse.failed") {
        return errorResponse(res, Messages.INVALID_JSON, HttpStatus.BAD_REQUEST);
    }

    console.error(err);
    return errorResponse(res, Messages.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
};
