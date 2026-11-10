import menuService from "../services/MenuService.js";
import { successResponse } from "../responses/ApiResponse.js";
import { HttpStatus } from "../enums/HttpStatus.js";
import { Messages } from "../enums/Messages.js";

class MenuController {
    getAll(req, res) {
        const { categoria, q } = req.query;
        return successResponse(res, menuService.getAll({ categoria, q }));
    }

    getById(req, res) {
        return successResponse(res, menuService.getById(Number(req.params.id)));
    }

    create(req, res) {
        const item = menuService.create(req.body);
        return successResponse(res, item, HttpStatus.CREATED, Messages.ITEM_CREATED);
    }

    update(req, res) {
        const item = menuService.update(Number(req.params.id), req.body);
        return successResponse(res, item, HttpStatus.OK, Messages.ITEM_UPDATED);
    }

    delete(req, res) {
        const item = menuService.delete(Number(req.params.id));
        return successResponse(res, item, HttpStatus.OK, Messages.ITEM_DELETED);
    }
}

export default new MenuController();
