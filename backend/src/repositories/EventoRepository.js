import Evento from "../models/Evento.js";
import store from "../db/store.js";

class EventoRepository {
    findAll() {
        return store.get("eventos");
    }

    findById(id) {
        return this.findAll().find((evento) => evento.idEvento === id);
    }

    findByDJ(idDJ) {
        return this.findAll().filter((evento) => evento.idsDJ.includes(idDJ));
    }

    create({ nombre, fecha, horaInicio, horaFin, capacidadMaxima, precio, idsDJ, descripcion }) {
        const evento = new Evento(
            store.nextId("eventos"),
            fecha,
            horaInicio,
            horaFin,
            capacidadMaxima,
            capacidadMaxima,
            nombre,
            precio,
            idsDJ,
            descripcion
        );
        this.findAll().push(evento);
        store.save();
        return evento;
    }

    update(id, data) {
        const evento = this.findById(id);

        evento.nombre = data.nombre;
        evento.fecha = data.fecha;
        evento.horaInicio = data.horaInicio;
        evento.horaFin = data.horaFin;
        evento.capacidadMaxima = data.capacidadMaxima;
        evento.entradasDisponibles = data.entradasDisponibles;
        evento.precio = data.precio;
        evento.idsDJ = data.idsDJ;
        evento.descripcion = data.descripcion;

        store.save();
        return evento;
    }

    // cantidad negativa = se venden; positiva = se devuelven (cancelación).
    ajustarEntradas(id, cantidad) {
        const evento = this.findById(id);
        evento.entradasDisponibles += cantidad;
        store.save();
        return evento;
    }

    delete(id) {
        const eventos = this.findAll();
        const index = eventos.findIndex((evento) => evento.idEvento === id);
        const [deleted] = eventos.splice(index, 1);
        store.save();
        return deleted;
    }
}

export default new EventoRepository();
