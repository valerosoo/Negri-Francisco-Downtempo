import menuRepository from "../repositories/MenuRepository.js";
import { NotFoundError, ConflictError } from "../exceptions/AppError.js";
import { Messages } from "../enums/Messages.js";

class MenuService {
    // Filtros opcionales: categoría exacta y texto libre (nombre o descripción).
    getAll({ categoria, q } = {}) {
        const categoriaBuscada = categoria?.trim().toLowerCase();
        const texto = q?.trim().toLowerCase();

        return menuRepository
            .findAll()
            .filter((item) => !categoriaBuscada || item.categoria.toLowerCase() === categoriaBuscada)
            .filter(
                (item) =>
                    !texto ||
                    item.nombre.toLowerCase().includes(texto) ||
                    item.descripcion.toLowerCase().includes(texto)
            );
    }

    getById(id) {
        const item = menuRepository.findById(id);

        if (!item) {
            throw new NotFoundError(Messages.ITEM_NOT_FOUND);
        }

        return item;
    }

    create(data) {
        this.#ensureNombreDisponible(data.nombre);

        return menuRepository.create(this.#normalize(data));
    }

    update(id, data) {
        this.getById(id);
        this.#ensureNombreDisponible(data.nombre, id);

        return menuRepository.update(id, this.#normalize(data));
    }

    delete(id) {
        this.getById(id);

        return menuRepository.delete(id);
    }

    #ensureNombreDisponible(nombre, idActual = null) {
        const existente = menuRepository.findByNombre(nombre.trim());

        if (existente && existente.idItem !== idActual) {
            throw new ConflictError(Messages.ITEM_DUPLICATED);
        }
    }

    #normalize({ nombre, descripcion = "", precio, categoria }) {
        return {
            nombre: nombre.trim(),
            descripcion: descripcion.trim(),
            precio,
            categoria: categoria.trim()
        };
    }
}

export default new MenuService();
