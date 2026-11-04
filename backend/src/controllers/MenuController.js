import menuService from "../services/MenuService.js";
import { successResponse } from "../responses/ApiResponse.js";

class MenuController {
    getAll(req, res) {
        return successResponse(res, menuService.getAll());
    }
}

export default new MenuController();
