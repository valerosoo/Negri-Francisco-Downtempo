import fs from "node:fs";
import path from "node:path";
import { config } from "../config/env.js";
import { buildSeed } from "./seed.js";

// Persistencia en un archivo JSON (backend/data/db.json). Los repositorios
// trabajan sobre las colecciones en memoria y llaman a save() después de cada
// cambio, así los datos sobreviven a los reinicios del servidor.
// Con DB_FILE=":memory:" no se toca el disco (lo usan los tests).
class Store {
    #file;
    #data;

    constructor(file) {
        this.#file = file === ":memory:" ? null : file;
        this.#data = this.#load();
    }

    #load() {
        if (this.#file && fs.existsSync(this.#file)) {
            try {
                // Las colecciones que falten (base creada por una versión anterior)
                // se completan con las del seed.
                const saved = JSON.parse(fs.readFileSync(this.#file, "utf8"));
                const seed = buildSeed();
                return { ...seed, ...saved, counters: { ...seed.counters, ...saved.counters } };
            } catch (error) {
                throw new Error(
                    `No se pudo leer ${this.#file} (${error.message}). ` +
                        "Corregilo o borralo para volver a los datos de ejemplo.",
                    { cause: error }
                );
            }
        }

        const seed = buildSeed();
        this.#write(seed);
        return seed;
    }

    #write(data) {
        if (!this.#file) return;
        fs.mkdirSync(path.dirname(this.#file), { recursive: true });
        fs.writeFileSync(this.#file, JSON.stringify(data, null, 2));
    }

    // Colección viva: los cambios sobre el array se persisten con save().
    get(collection) {
        return this.#data[collection];
    }

    nextId(collection) {
        return this.#data.counters[collection]++;
    }

    save() {
        this.#write(this.#data);
    }

    // Vuelve a los datos de ejemplo.
    reset() {
        this.#data = buildSeed();
        this.save();
    }
}

export default new Store(config.dbFile);
