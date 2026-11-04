import eventoService from "../services/EventoService.js";
import { successResponse } from "../responses/ApiResponse.js";
import { HttpStatus } from "../enums/HttpStatus.js";
import { Messages } from "../enums/Messages.js";

class EventoController {
    getAll(req, res) {
        return successResponse(res, eventoService.getAll());
    }

    getById(req, res) {
        return successResponse(res, eventoService.getById(Number(req.params.id)));
    }

    create(req, res) {
        const evento = eventoService.create(req.body);
        return successResponse(res, evento, HttpStatus.CREATED, Messages.EVENTO_CREATED);
    }

    update(req, res) {
        const evento = eventoService.update(Number(req.params.id), req.body);
        return successResponse(res, evento, HttpStatus.OK, Messages.EVENTO_UPDATED);
    }

    delete(req, res) {
        const evento = eventoService.delete(Number(req.params.id));
        return successResponse(res, evento, HttpStatus.OK, Messages.EVENTO_DELETED);
    }
}

export default new EventoController();
