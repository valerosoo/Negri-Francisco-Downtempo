import eventoRepository from "../repositories/EventoRepository.js";
import reservaRepository from "../repositories/ReservaRepository.js";
import djRepository from "../repositories/DJRepository.js";
import { NotFoundError, ConflictError, BadRequestError } from "../exceptions/AppError.js";
import { Messages } from "../enums/Messages.js";

class EventoService {
    // Devuelve la cartelera ordenada por fecha, con los DJs ya resueltos
    // (el front no tiene que cruzar ids contra /api/djs).
    // Filtros opcionales: { genero, dj (id), desde, hasta, disponibles }.
    getAll({ genero, dj, desde, hasta, disponibles } = {}) {
        const generoBuscado = genero?.trim().toLowerCase();

        return eventoRepository
            .findAll()
            .map((evento) => this.#withDJs(evento))
            .filter((evento) => !desde || evento.fecha >= desde)
            .filter((evento) => !hasta || evento.fecha <= hasta)
            .filter((evento) => !dj || evento.idsDJ.includes(dj))
            .filter((evento) => !disponibles || evento.entradasDisponibles > 0)
            .filter(
                (evento) =>
                    !generoBuscado || evento.djs.some((d) => d.generoMusical.toLowerCase() === generoBuscado)
            )
            .sort((a, b) => a.fecha.localeCompare(b.fecha) || a.horaInicio.localeCompare(b.horaInicio));
    }

    getById(id) {
        return this.#withDJs(this.getEntity(id));
    }

    // Uso interno de otros servicios (ej. ReservaService): el evento sin DJs resueltos.
    getEntity(id) {
        const evento = eventoRepository.findById(id);

        if (!evento) {
            throw new NotFoundError(Messages.EVENTO_NOT_FOUND);
        }

        return evento;
    }

    create(data) {
        const normalized = this.#normalize(data);
        this.#ensureDJsExisten(normalized.idsDJ);

        return this.#withDJs(eventoRepository.create(normalized));
    }

    update(id, data) {
        const actual = this.getEntity(id);
        const normalized = this.#normalize(data);
        this.#ensureDJsExisten(normalized.idsDJ);

        const vendidas = actual.capacidadMaxima - actual.entradasDisponibles;
        const entradasDisponibles = normalized.capacidadMaxima - vendidas;

        if (entradasDisponibles < 0) {
            throw new ConflictError(Messages.EVENTO_CAPACIDAD_INSUFICIENTE);
        }

        return this.#withDJs(eventoRepository.update(id, { ...normalized, entradasDisponibles }));
    }

    delete(id) {
        this.getEntity(id);

        if (reservaRepository.findByEvento(id).length > 0) {
            throw new ConflictError(Messages.EVENTO_CON_RESERVAS);
        }

        return eventoRepository.delete(id);
    }

    #ensureDJsExisten(idsDJ) {
        if (!idsDJ.every((idDJ) => djRepository.findById(idDJ))) {
            throw new BadRequestError(Messages.EVENTO_DJ_NOT_FOUND);
        }
    }

    #withDJs(evento) {
        const djs = evento.idsDJ.map((idDJ) => djRepository.findById(idDJ)).filter(Boolean);
        return { ...evento, djs };
    }

    #normalize({ nombre, fecha, horaInicio, horaFin, capacidadMaxima, precio, idsDJ = [], descripcion = "" }) {
        return {
            nombre: nombre.trim(),
            fecha,
            horaInicio,
            horaFin,
            capacidadMaxima,
            precio,
            idsDJ: [...new Set(idsDJ)],
            descripcion: descripcion.trim()
        };
    }
}

export default new EventoService();
