import reservaRepository from "../repositories/ReservaRepository.js";
import eventoRepository from "../repositories/EventoRepository.js";
import clienteRepository from "../repositories/ClienteRepository.js";
import menuRepository from "../repositories/MenuRepository.js";
import eventoService from "./EventoService.js";
import { EstadoReserva } from "../models/Reserva.js";
import { NotFoundError, ConflictError, BadRequestError } from "../exceptions/AppError.js";
import { Messages } from "../enums/Messages.js";
import { hoy } from "../utils/fechas.js";

// Sin caracteres ambiguos (0/O, 1/I) para que el código se lea bien en la puerta.
const ALFABETO = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

class ReservaService {
    // Todas las reservas, de la más nueva a la más vieja (panel de administración).
    getAll() {
        return this.#detalles(reservaRepository.findAll());
    }

    getById(id) {
        return this.detalle(this.#getEntity(id));
    }

    // "Mis reservas": el cliente se identifica por el email de la compra.
    getByEmail(email) {
        return this.#detalles(reservaRepository.findByEmail(this.#normalizarEmail(email)));
    }

    // Compra simulada: valida el evento y el cupo, descuenta las entradas y
    // genera un código único por cada una. No hay cobro real.
    // `pedido` es opcional: [{ idItem, cantidad }] para dejar tragos o comida encargados.
    create({ idEvento, cantidadEntradas, nombre, email, pedido = [] }) {
        const evento = eventoService.getEntity(idEvento);

        if (evento.fecha < hoy()) {
            throw new BadRequestError(Messages.EVENTO_PASADO);
        }

        if (evento.entradasDisponibles < cantidadEntradas) {
            throw new ConflictError(Messages.SIN_CUPO);
        }

        const pedidoResuelto = this.#resolverPedido(pedido);
        const cliente = this.#obtenerCliente(nombre.trim(), this.#normalizarEmail(email));
        const codigos = [];

        while (codigos.length < cantidadEntradas) {
            const codigo = this.#generarCodigo();
            if (!codigos.includes(codigo)) codigos.push(codigo);
        }

        eventoRepository.ajustarEntradas(idEvento, -cantidadEntradas);

        const reserva = reservaRepository.create({
            idEvento,
            idCliente: cliente.idCliente,
            nombreCliente: cliente.nombre,
            email: cliente.email,
            codigos,
            pedido: pedidoResuelto
        });

        return this.detalle(reserva);
    }

    // Cancela la reserva y devuelve las entradas al cupo del evento. Hay que
    // indicar el mismo email con el que se compró.
    cancel(id, email) {
        const reserva = this.#getEntity(id);

        if (reserva.email !== this.#normalizarEmail(email)) {
            throw new BadRequestError(Messages.RESERVA_EMAIL_NO_COINCIDE);
        }

        if (reserva.estado === EstadoReserva.CANCELADA) {
            throw new ConflictError(Messages.RESERVA_YA_CANCELADA);
        }

        if (eventoService.getEntity(reserva.idEvento).fecha < hoy()) {
            throw new ConflictError(Messages.RESERVA_NO_CANCELABLE_PASADA);
        }

        if (reserva.entradas.some((entrada) => entrada.usada)) {
            throw new ConflictError(Messages.RESERVA_NO_CANCELABLE_USADA);
        }

        eventoRepository.ajustarEntradas(reserva.idEvento, reserva.cantidadEntradas);

        return this.detalle(reservaRepository.cancelar(id));
    }

    // Reserva + datos del evento + totales. También lo usa EntradaService.
    detalle(reserva) {
        const evento = eventoService.getEntity(reserva.idEvento);
        const totalEntradas = evento.precio * reserva.cantidadEntradas;
        const totalPedido = reserva.pedido.reduce((suma, item) => suma + item.precio * item.cantidad, 0);

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
            totalEntradas,
            totalPedido,
            total: totalEntradas + totalPedido
        };
    }

    #detalles(reservas) {
        return reservas
            .map((reserva) => this.detalle(reserva))
            .sort((a, b) => b.fechaReserva.localeCompare(a.fechaReserva) || b.idReserva - a.idReserva);
    }

    #getEntity(id) {
        const reserva = reservaRepository.findById(id);

        if (!reserva) {
            throw new NotFoundError(Messages.RESERVA_NOT_FOUND);
        }

        return reserva;
    }

    #normalizarEmail(email) {
        return email.trim().toLowerCase();
    }

    #obtenerCliente(nombre, email) {
        const existente = clienteRepository.findByEmail(email);

        if (!existente) {
            return clienteRepository.create({ nombre, email });
        }

        return existente.nombre === nombre ? existente : clienteRepository.updateNombre(existente, nombre);
    }

    // Junta ítems repetidos y congela nombre y precio del menú al momento de la compra.
    #resolverPedido(pedido) {
        const cantidades = new Map();

        pedido.forEach(({ idItem, cantidad }) => {
            cantidades.set(idItem, (cantidades.get(idItem) ?? 0) + cantidad);
        });

        return [...cantidades.entries()].map(([idItem, cantidad]) => {
            const item = menuRepository.findById(idItem);

            if (!item) {
                throw new BadRequestError(Messages.PEDIDO_ITEM_NOT_FOUND);
            }

            return { idItem, nombre: item.nombre, precio: item.precio, cantidad };
        });
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
