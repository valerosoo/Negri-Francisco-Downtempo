import djRepository from "../repositories/DJRepository.js";
import { NotFoundError, ConflictError } from "../exceptions/AppError.js";
import { Messages } from "../enums/Messages.js";

class DJService {
    getAll() {
        return djRepository.findAll();
    }

    getById(id) {
        const dj = djRepository.findById(id);

        if (!dj) {
            throw new NotFoundError(Messages.DJ_NOT_FOUND);
        }

        return dj;
    }

    create(data) {
        this.#ensureNombreDisponible(data.nombre);

        return djRepository.create(this.#normalize(data));
    }

    update(id, data) {
        this.getById(id);
        this.#ensureNombreDisponible(data.nombre, id);

        return djRepository.update(id, this.#normalize(data));
    }

    delete(id) {
        this.getById(id);

        return djRepository.delete(id);
    }

    #ensureNombreDisponible(nombre, idActual = null) {
        const existente = djRepository.findByNombre(nombre.trim());

        if (existente && existente.idDJ !== idActual) {
            throw new ConflictError(Messages.DJ_DUPLICATED);
        }
    }

    #normalize({ nombre, generoMusical, biografia = "", cantidadLikes = 0 }) {
        return {
            nombre: nombre.trim(),
            generoMusical: generoMusical.trim(),
            biografia: biografia.trim(),
            cantidadLikes
        };
    }
}

export default new DJService();
