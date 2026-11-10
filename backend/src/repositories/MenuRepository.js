import ItemMenu from "../models/ItemMenu.js";
import store from "../db/store.js";

class MenuRepository {
    findAll() {
        return store.get("items");
    }

    findById(id) {
        return this.findAll().find((item) => item.idItem === id);
    }

    findByNombre(nombre) {
        return this.findAll().find((item) => item.nombre.toLowerCase() === nombre.toLowerCase());
    }

    create({ nombre, descripcion, precio, categoria }) {
        const item = new ItemMenu(store.nextId("items"), nombre, descripcion, precio, categoria);
        this.findAll().push(item);
        store.save();
        return item;
    }

    update(id, { nombre, descripcion, precio, categoria }) {
        const item = this.findById(id);

        item.nombre = nombre;
        item.descripcion = descripcion;
        item.precio = precio;
        item.categoria = categoria;

        store.save();
        return item;
    }

    delete(id) {
        const items = this.findAll();
        const index = items.findIndex((item) => item.idItem === id);
        const [deleted] = items.splice(index, 1);
        store.save();
        return deleted;
    }
}

export default new MenuRepository();
