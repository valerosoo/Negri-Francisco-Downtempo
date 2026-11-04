import reservaRepository from "../repositories/ReservaRepository.js";
import eventoRepository from "../repositories/EventoRepository.js";
import eventoService from "./EventoService.js";
import { NotFoundError, ConflictError, BadRequestError } from "../exceptions/AppError.js";
import { Messages } from "../enums/Messages.js";

// Sin caracteres ambiguos (0/O, 1/I) para que el código se lea bien en la puerta.
const ALFABETO = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

class ReservaService {
    getById(id) {
        const reserva = reservaRepository.findById(id);

        if (!reserva) {
            throw new NotFoundError(Messages.RESERVA_NOT_FOUND);
        }

        return this.#detalle(reserva);
    }

    // Compra simulada: valida el evento y el cupo, descuenta las entradas y
    // genera un código único por cada una. No hay cobro real.
    create({ idEvento, cantidadEntradas, nombre, email }) {
        const evento = eventoService.getEntity(idEvento);

        if (evento.fecha < this.#hoy()) {
            throw new BadRequestError(Messages.EVENTO_PASADO);
        }

        if (evento.entradasDisponibles < cantidadEntradas) {
            throw new ConflictError(Messages.SIN_CUPO);
        }

        const codigos = Array.from({ length: cantidadEntradas }, () => this.#generarCodigo());

        eventoRepository.descontarEntradas(idEvento, cantidadEntradas);

        const reserva = reservaRepository.create({
            idEvento,
            nombreCliente: nombre.trim(),
            email: email.trim().toLowerCase(),
            codigos
        });

        return this.#detalle(reserva);
    }

    #detalle(reserva) {
        const evento = eventoService.getById(reserva.idEvento);

        return {
            ...reserva,
            evento: {
                idEvento: evento.idEvento,
                nombre: evento.nombre,
                fecha: evento.fecha,
                horaInicio: evento.horaInicio,
                horaFin: evento.horaFin,
                precio: evento.precio
            },
            total: evento.precio * reserva.cantidadEntradas
        };
    }

    #hoy() {
        return new Date().toISOString().slice(0, 10);
    }

    #generarCodigo() {
        let codigo;

        do {
            const sufijo = Array.from(
                { length: 6 },
                () => ALFABETO[Math.floor(Math.random() * ALFABETO.length)]
            ).join("");
            codigo = `DT-${sufijo}`;
        } while (reservaRepository.existsCodigo(codigo));

        return codigo;
    }
}

export default new ReservaService();
