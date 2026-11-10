import { createHash, timingSafeEqual } from "node:crypto";
import { UnauthorizedError } from "../exceptions/AppError.js";
import { Messages } from "../enums/Messages.js";
import { config } from "../config/env.js";

const digest = (value) => createHash("sha256").update(String(value)).digest();

export const isAdminKey = (key) => {
    return typeof key === "string" && timingSafeEqual(digest(key), digest(config.adminKey));
};

// Protege las rutas de administración: la clave (ADMIN_KEY del .env) viaja en
// el header x-admin-key.
export const requireAdmin = (req, res, next) => {
    if (!isAdminKey(req.get("x-admin-key"))) {
        throw new UnauthorizedError(Messages.UNAUTHORIZED);
    }

    next();
};
