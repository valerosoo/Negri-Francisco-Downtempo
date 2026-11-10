// `npm run seed`: borra los datos guardados y vuelve a los de ejemplo, con la
// cartelera regenerada a partir de hoy.
import store from "./store.js";
import { config } from "../config/env.js";

store.reset();
console.log(`Base reiniciada con los datos de ejemplo en ${config.dbFile}`);
