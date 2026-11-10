import { successResponse } from "../responses/ApiResponse.js";
import { HttpStatus } from "../enums/HttpStatus.js";
import { Messages } from "../enums/Messages.js";

class AdminController {
    // La clave ya la verificó requireAdmin: llegar acá significa que es correcta.
    // El panel usa este endpoint para comprobarla antes de guardarla.
    login(req, res) {
        return successResponse(res, { admin: true }, HttpStatus.OK, Messages.ADMIN_OK);
    }
}

export default new AdminController();
