import reservaRepository from "../repositories/ReservaRepository.js";
import reservaService from "./ReservaService.js";
import { EstadoReserva } from "../models/Reserva.js";
import { NotFoundError, ConflictError } from "../exceptions/AppError.js";
import { Messages } from "../enums/Messages.js";

export const EstadoEntrada = Object.freeze({
    VALIDA: "valida",
    USADA: "usada",
    CANCELADA: "cancelada"
});

class EntradaService {
    // Consulta de una entrada por su código (DT-XXXXXX), con su evento y estado.
    getByCodigo(codigo) {
        const { reserva, entrada } = this.#buscar(codigo);
        const { evento, idReserva, nombreCliente } = reservaService.detalle(reserva);

        return { ...entrada, estado: this.#estado(reserva, entrada), idReserva, nombreCliente, evento };
    }

    // Control de puerta: marca la entrada como usada. Solo se puede una vez.
    validar(codigo) {
        const { reserva, entrada } = this.#buscar(codigo);
        const estado = this.#estado(reserva, entrada);

        if (estado === EstadoEntrada.CANCELADA) {
            throw new ConflictError(Messages.ENTRADA_CANCELADA);
        }

        if (estado === EstadoEntrada.USADA) {
            throw new ConflictError(Messages.ENTRADA_YA_USADA);
        }

        reservaRepository.marcarEntradaUsada(entrada.codigo);

        return this.getByCodigo(entrada.codigo);
    }

    #buscar(codigo) {
        const encontrada = reservaRepository.findByCodigo(codigo.trim().toUpperCase());

        if (!encontrada) {
            throw new NotFoundError(Messages.ENTRADA_NOT_FOUND);
        }

        return encontrada;
    }

    #estado(reserva, entrada) {
        if (reserva.estado === EstadoReserva.CANCELADA) return EstadoEntrada.CANCELADA;
        return entrada.usada ? EstadoEntrada.USADA : EstadoEntrada.VALIDA;
    }
}

export default new EntradaService();
