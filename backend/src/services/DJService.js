import djRepository from "../repositories/DJRepository.js";
import eventoRepository from "../repositories/EventoRepository.js";
import playlistRepository from "../repositories/PlaylistRepository.js";
import recomendacionRepository from "../repositories/RecomendacionRepository.js";
import { NotFoundError, ConflictError } from "../exceptions/AppError.js";
import { Messages } from "../enums/Messages.js";
import { hoy } from "../utils/fechas.js";

const MAX_SIMILARES = 3;

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
        const actual = this.getById(id);
        this.#ensureNombreDisponible(data.nombre, id);

        // Si no mandan los likes, se conservan los que ya tenía.
        return djRepository.update(id, this.#normalize({ cantidadLikes: actual.cantidadLikes, ...data }));
    }

    like(id) {
        this.getById(id);

        return djRepository.sumarLike(id);
    }

    delete(id) {
        this.getById(id);

        const tieneFechasProximas = eventoRepository.findByDJ(id).some((evento) => evento.fecha >= hoy());

        if (tieneFechasProximas) {
            throw new ConflictError(Messages.DJ_CON_EVENTOS);
        }

        playlistRepository.deleteByDJ(id);
        recomendacionRepository.deleteByDJ(id);

        return djRepository.delete(id);
    }

    getPlaylists(id) {
        this.getById(id);

        return playlistRepository.findByDJ(id);
    }

    // "Si te gusta este DJ…": primero los del mismo género y, si no alcanzan,
    // se completa con los más likeados. Cada uno indica si comparte género.
    getSimilares(id) {
        const dj = this.getById(id);
        const genero = dj.generoMusical.toLowerCase();

        return djRepository
            .findAll()
            .filter((otro) => otro.idDJ !== id)
            .map((otro) => ({ ...otro, mismoGenero: otro.generoMusical.toLowerCase() === genero }))
            .sort((a, b) => b.mismoGenero - a.mismoGenero || b.cantidadLikes - a.cantidadLikes)
            .slice(0, MAX_SIMILARES);
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
