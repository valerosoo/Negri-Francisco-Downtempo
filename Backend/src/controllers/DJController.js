import djService from "../services/DJService.js";
import { successResponse } from "../responses/ApiResponse.js";
import { HttpStatus } from "../enums/HttpStatus.js";
import { Messages } from "../enums/Messages.js";

class DJController {
    getAll(req, res) {
        const djs = djService.getAll();
        return successResponse(res, djs);
    }

    getById(req, res) {
        const dj = djService.getById(Number(req.params.id));
        return successResponse(res, dj);
    }

    create(req, res) {
        const dj = djService.create(req.body);
        return successResponse(res, dj, HttpStatus.CREATED, Messages.DJ_CREATED);
    }

    update(req, res) {
        const dj = djService.update(Number(req.params.id), req.body);
        return successResponse(res, dj, HttpStatus.OK, Messages.DJ_UPDATED);
    }

    delete(req, res) {
        const dj = djService.delete(Number(req.params.id));
        return successResponse(res, dj, HttpStatus.OK, Messages.DJ_DELETED);
    }
}

export default new DJController();
