import Evento from "../models/Evento.js";

// Fecha ISO (YYYY-MM-DD) a N días de hoy, para que la cartelera de ejemplo
// siempre tenga fechas futuras sin importar cuándo se levante el servidor.
const diasDesdeHoy = (dias) => {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + dias);
    return fecha.toISOString().slice(0, 10);
};

// Persistencia temporal en memoria
const eventos = [
    new Evento(1, diasDesdeHoy(3), "22:00", "04:00", 150, 150, "Sunset Sessions", 8000, [1, 2]),
    new Evento(2, diasDesdeHoy(10), "22:00", "05:00", 200, 200, "Noche Experimental", 10000, [3]),
    new Evento(3, diasDesdeHoy(17), "21:00", "04:00", 120, 120, "Rooftop Downtempo", 9000, [1, 3]),
    new Evento(4, diasDesdeHoy(24), "22:00", "05:00", 180, 180, "Cierre de Mes", 12000, [1, 2, 3])
];

let nextId = eventos.length + 1;

class EventoRepository {
    findAll() {
        return eventos;
    }

    findById(id) {
        return eventos.find((evento) => evento.idEvento === id);
    }

    create({ nombre, fecha, horaInicio, horaFin, capacidadMaxima, precio, idsDJ }) {
        const evento = new Evento(
            nextId++,
            fecha,
            horaInicio,
            horaFin,
            capacidadMaxima,
            capacidadMaxima,
            nombre,
            precio,
            idsDJ
        );
        eventos.push(evento);
        return evento;
    }

    update(id, { nombre, fecha, horaInicio, horaFin, capacidadMaxima, entradasDisponibles, precio, idsDJ }) {
        const evento = this.findById(id);

        evento.nombre = nombre;
        evento.fecha = fecha;
        evento.horaInicio = horaInicio;
        evento.horaFin = horaFin;
        evento.capacidadMaxima = capacidadMaxima;
        evento.entradasDisponibles = entradasDisponibles;
        evento.precio = precio;
        evento.idsDJ = idsDJ;

        return evento;
    }

    descontarEntradas(id, cantidad) {
        const evento = this.findById(id);
        evento.entradasDisponibles -= cantidad;
        return evento;
    }

    delete(id) {
        const index = eventos.findIndex((evento) => evento.idEvento === id);
        const [deleted] = eventos.splice(index, 1);
        return deleted;
    }
}

export default new EventoRepository();
