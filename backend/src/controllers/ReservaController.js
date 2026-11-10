import reservaService from "../services/ReservaService.js";
import { successResponse } from "../responses/ApiResponse.js";
import { HttpStatus } from "../enums/HttpStatus.js";
import { Messages } from "../enums/Messages.js";

class ReservaController {
    getAll(req, res) {
        return successResponse(res, reservaService.getAll());
    }

    getByEmail(req, res) {
        return successResponse(res, reservaService.getByEmail(req.query.email));
    }

    getById(req, res) {
        return successResponse(res, reservaService.getById(Number(req.params.id)));
    }

    create(req, res) {
        const reserva = reservaService.create(req.body);
        return successResponse(res, reserva, HttpStatus.CREATED, Messages.RESERVA_CREATED);
    }

    cancel(req, res) {
        const reserva = reservaService.cancel(Number(req.params.id), req.query.email);
        return successResponse(res, reserva, HttpStatus.OK, Messages.RESERVA_CANCELADA);
    }
}

export default new ReservaController();
