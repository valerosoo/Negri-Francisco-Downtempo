class Evento {
    constructor(
        idEvento,
        fecha,
        horaInicio,
        horaFin,
        capacidadMaxima,
        entradasDisponibles,
        nombre,
        precio,
        idsDJ = [],
        descripcion = ""
    ) {
        this.idEvento = idEvento;
        this.fecha = fecha;
        this.horaInicio = horaInicio;
        this.horaFin = horaFin;
        this.capacidadMaxima = capacidadMaxima;
        this.entradasDisponibles = entradasDisponibles;
        this.nombre = nombre;
        this.precio = precio;
        this.idsDJ = idsDJ;
        this.descripcion = descripcion;
    }
}

export default Evento;
