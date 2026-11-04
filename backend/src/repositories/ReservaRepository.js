import Reserva from "../models/Reserva.js";
import Entrada from "../models/Entrada.js";

// Persistencia temporal en memoria
const reservas = [];

let nextReservaId = 1;
let nextEntradaId = 1;

class ReservaRepository {
    findAll() {
        return reservas;
    }

    findById(id) {
        return reservas.find((reserva) => reserva.idReserva === id);
    }

    findByEvento(idEvento) {
        return reservas.filter((reserva) => reserva.idEvento === idEvento);
    }

    existsCodigo(codigo) {
        return reservas.some((reserva) => reserva.entradas.some((entrada) => entrada.codigo === codigo));
    }

    findByCodigo(codigo) {
        for (const reserva of reservas) {
            const entrada = reserva.entradas.find((e) => e.codigo === codigo);
            if (entrada) return { reserva, entrada };
        }
        return undefined;
    }

    create({ idEvento, nombreCliente, email, codigos }) {
        const entradas = codigos.map((codigo) => new Entrada(nextEntradaId++, codigo, nombreCliente));
        const reserva = new Reserva(
            nextReservaId++,
            new Date().toISOString(),
            entradas.length,
            idEvento,
            nombreCliente,
            email,
            entradas
        );
        reservas.push(reserva);
        return reserva;
    }
}

export default new ReservaRepository();
