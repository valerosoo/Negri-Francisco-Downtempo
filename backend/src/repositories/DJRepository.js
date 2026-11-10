import DJ from "../models/DJ.js";
import store from "../db/store.js";

class DJRepository {
    findAll() {
        return store.get("djs");
    }

    findById(id) {
        return this.findAll().find((dj) => dj.idDJ === id);
    }

    findByNombre(nombre) {
        return this.findAll().find((dj) => dj.nombre.toLowerCase() === nombre.toLowerCase());
    }

    create({ nombre, generoMusical, biografia, cantidadLikes }) {
        const dj = new DJ(store.nextId("djs"), nombre, generoMusical, biografia, cantidadLikes);
        this.findAll().push(dj);
        store.save();
        return dj;
    }

    update(id, { nombre, generoMusical, biografia, cantidadLikes }) {
        const dj = this.findById(id);

        dj.nombre = nombre;
        dj.generoMusical = generoMusical;
        dj.biografia = biografia;
        dj.cantidadLikes = cantidadLikes;

        store.save();
        return dj;
    }

    sumarLike(id) {
        const dj = this.findById(id);
        dj.cantidadLikes += 1;
        store.save();
        return dj;
    }

    delete(id) {
        const djs = this.findAll();
        const index = djs.findIndex((dj) => dj.idDJ === id);
        const [deleted] = djs.splice(index, 1);
        store.save();
        return deleted;
    }
}

export default new DJRepository();
