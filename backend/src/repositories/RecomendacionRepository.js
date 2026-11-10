import Recomendacion from "../models/Recomendacion.js";
import store from "../db/store.js";

class RecomendacionRepository {
    findAll() {
        return store.get("recomendaciones");
    }

    findByDJ(idDJ) {
        return this.findAll().filter((recomendacion) => recomendacion.idDJ === idDJ);
    }

    create({ idDJ, tituloCancion, artista, mensaje, nombreCliente }) {
        const recomendacion = new Recomendacion(
            store.nextId("recomendaciones"),
            tituloCancion,
            artista,
            mensaje,
            new Date().toISOString(),
            idDJ,
            nombreCliente
        );
        this.findAll().push(recomendacion);
        store.save();
        return recomendacion;
    }

    deleteByDJ(idDJ) {
        const todas = this.findAll();
        const restantes = todas.filter((recomendacion) => recomendacion.idDJ !== idDJ);
        todas.splice(0, todas.length, ...restantes);
        store.save();
    }
}

export default new RecomendacionRepository();
