import { BadRequestError } from "../exceptions/AppError.js";
import { Messages } from "../enums/Messages.js";
import { isPositiveIntegerString } from "../utils/validators.js";

export const validateId = (req, res, next) => {
    if (!isPositiveIntegerString(req.params.id)) {
        throw new BadRequestError(Messages.INVALID_ID);
    }

    next();
};
