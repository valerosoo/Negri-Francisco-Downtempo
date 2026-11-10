import Cliente from "../models/Cliente.js";
import store from "../db/store.js";

class ClienteRepository {
    findAll() {
        return store.get("clientes");
    }

    findByEmail(email) {
        return this.findAll().find((cliente) => cliente.email === email);
    }

    // Todavía no hay registro con contraseña: el cliente se crea solo con la
    // primera compra y se identifica por email.
    create({ nombre, email }) {
        const cliente = new Cliente(store.nextId("clientes"), nombre, email, null, new Date().toISOString());
        this.findAll().push(cliente);
        store.save();
        return cliente;
    }

    updateNombre(cliente, nombre) {
        cliente.nombre = nombre;
        store.save();
        return cliente;
    }
}

export default new ClienteRepository();
