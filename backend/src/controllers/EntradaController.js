import entradaService from "../services/EntradaService.js";
import { successResponse } from "../responses/ApiResponse.js";
import { HttpStatus } from "../enums/HttpStatus.js";
import { Messages } from "../enums/Messages.js";

class EntradaController {
    getByCodigo(req, res) {
        return successResponse(res, entradaService.getByCodigo(req.params.codigo));
    }

    validar(req, res) {
        const entrada = entradaService.validar(req.params.codigo);
        return successResponse(res, entrada, HttpStatus.OK, Messages.ENTRADA_VALIDADA);
    }
}

export default new EntradaController();
