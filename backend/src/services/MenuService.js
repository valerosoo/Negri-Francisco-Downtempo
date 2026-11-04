import menuRepository from "../repositories/MenuRepository.js";

class MenuService {
    getAll() {
        return menuRepository.findAll();
    }
}

export default new MenuService();
