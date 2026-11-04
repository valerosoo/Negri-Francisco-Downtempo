import reservaService from "../services/ReservaService.js";
import { successResponse } from "../responses/ApiResponse.js";
import { HttpStatus } from "../enums/HttpStatus.js";
import { Messages } from "../enums/Messages.js";

class ReservaController {
    getById(req, res) {
        return successResponse(res, reservaService.getById(Number(req.params.id)));
    }

    create(req, res) {
        const reserva = reservaService.create(req.body);
        return successResponse(res, reserva, HttpStatus.CREATED, Messages.RESERVA_CREATED);
    }
}

export default new ReservaController();
