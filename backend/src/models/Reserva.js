export const EstadoReserva = Object.freeze({
    CONFIRMADA: "confirmada",
    CANCELADA: "cancelada"
});

class Reserva {
    constructor(
        idReserva,
        fechaReserva,
        cantidadEntradas,
        idEvento,
        nombreCliente,
        email,
        entradas = [],
        idCliente = null,
        pedido = [],
        estado = EstadoReserva.CONFIRMADA
    ) {
        this.idReserva = idReserva;
        this.fechaReserva = fechaReserva;
        this.cantidadEntradas = cantidadEntradas;
        this.idEvento = idEvento;
        this.nombreCliente = nombreCliente;
        this.email = email;
        this.entradas = entradas;
        this.idCliente = idCliente;
        // Pre-pedido del menú: [{ idItem, nombre, precio, cantidad }]. Se guarda
        // el nombre y el precio del momento de la compra.
        this.pedido = pedido;
        this.estado = estado;
    }
}

export default Reserva;
