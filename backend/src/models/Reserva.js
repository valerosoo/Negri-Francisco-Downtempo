class Reserva {
    constructor(idReserva, fechaReserva, cantidadEntradas, idEvento, nombreCliente, email, entradas = []) {
        this.idReserva = idReserva;
        this.fechaReserva = fechaReserva;
        this.cantidadEntradas = cantidadEntradas;
        this.idEvento = idEvento;
        this.nombreCliente = nombreCliente;
        this.email = email;
        this.entradas = entradas;
    }
}

export default Reserva;
