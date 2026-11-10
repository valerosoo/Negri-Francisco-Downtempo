import Reserva, { EstadoReserva } from "../models/Reserva.js";
import Entrada from "../models/Entrada.js";
import store from "../db/store.js";

class ReservaRepository {
    findAll() {
        return store.get("reservas");
    }

    findById(id) {
        return this.findAll().find((reserva) => reserva.idReserva === id);
    }

    findByEvento(idEvento) {
        return this.findAll().filter((reserva) => reserva.idEvento === idEvento);
    }

    findByEmail(email) {
        return this.findAll().filter((reserva) => reserva.email === email);
    }

    existsCodigo(codigo) {
        return Boolean(this.findByCodigo(codigo));
    }

    findByCodigo(codigo) {
        for (const reserva of this.findAll()) {
            const entrada = reserva.entradas.find((e) => e.codigo === codigo);
            if (entrada) return { reserva, entrada };
        }
        return undefined;
    }

    create({ idEvento, idCliente, nombreCliente, email, codigos, pedido }) {
        const entradas = codigos.map((codigo) => new Entrada(store.nextId("entradas"), codigo, nombreCliente));
        const reserva = new Reserva(
            store.nextId("reservas"),
            new Date().toISOString(),
            entradas.length,
            idEvento,
            nombreCliente,
            email,
            entradas,
            idCliente,
            pedido
        );
        this.findAll().push(reserva);
        store.save();
        return reserva;
    }

    cancelar(id) {
        const reserva = this.findById(id);
        reserva.estado = EstadoReserva.CANCELADA;
        store.save();
        return reserva;
    }

    marcarEntradaUsada(codigo) {
        const { entrada } = this.findByCodigo(codigo);
        entrada.usada = true;
        store.save();
        return entrada;
    }
}

export default new ReservaRepository();
