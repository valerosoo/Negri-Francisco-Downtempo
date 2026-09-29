import DJ from "../models/DJ.js";

// Persistencia temporal en memoria
const djs = [
    new DJ(1, "Bonobo", "Downtempo", "Productor británico de música electrónica.", 120),
    new DJ(2, "Tycho", "Chillwave", "Músico y productor estadounidense.", 85),
    new DJ(3, "Nicolas Jaar", "Electrónica experimental", "Compositor chileno-estadounidense.", 97)
];

let nextId = djs.length + 1;

class DJRepository {
    findAll() {
        return djs;
    }

    findById(id) {
        return djs.find((dj) => dj.idDJ === id);
    }

    findByNombre(nombre) {
        return djs.find((dj) => dj.nombre.toLowerCase() === nombre.toLowerCase());
    }

    create({ nombre, generoMusical, biografia, cantidadLikes }) {
        const dj = new DJ(nextId++, nombre, generoMusical, biografia, cantidadLikes);
        djs.push(dj);
        return dj;
    }

    update(id, { nombre, generoMusical, biografia, cantidadLikes }) {
        const dj = this.findById(id);

        dj.nombre = nombre;
        dj.generoMusical = generoMusical;
        dj.biografia = biografia;
        dj.cantidadLikes = cantidadLikes;

        return dj;
    }

    delete(id) {
        const index = djs.findIndex((dj) => dj.idDJ === id);
        const [deleted] = djs.splice(index, 1);
        return deleted;
    }
}

export default new DJRepository();
