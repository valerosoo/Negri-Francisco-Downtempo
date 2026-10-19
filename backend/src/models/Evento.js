class Evento {
  constructor(
    idEvento,
    fecha,
    horaInicio,
    horaFin,
    capacidadMaxima,
    entradasDisponibles
  ) {
    this.idEvento = idEvento;
    this.fecha = fecha;
    this.horaInicio = horaInicio;
    this.horaFin = horaFin;
    this.capacidadMaxima = capacidadMaxima;
    this.entradasDisponibles = entradasDisponibles;
  }
}

export default Evento;
