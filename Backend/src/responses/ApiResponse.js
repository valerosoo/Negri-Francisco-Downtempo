import { HttpStatus } from "../enums/HttpStatus.js";

export const successResponse = (res, data, statusCode = HttpStatus.OK, message) => {
    const body = { success: true };

    if (message) {
        body.message = message;
    }

    body.data = data;

    return res.status(statusCode).json(body);
};

export const errorResponse = (res, message, statusCode = HttpStatus.INTERNAL_SERVER_ERROR) => {
    return res.status(statusCode).json({
        success: false,
        message
    });
};
