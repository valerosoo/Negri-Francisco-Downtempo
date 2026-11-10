import path from "node:path";
import { fileURLToPath } from "node:url";

const backendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

// Carga backend/.env si existe (ver .env.example). Las variables que ya
// estén definidas en el entorno tienen prioridad.
try {
    process.loadEnvFile(path.join(backendRoot, ".env"));
} catch {
    // Sin .env se usan los valores por defecto de abajo.
}

const dbFile = process.env.DB_FILE || "data/db.json";

export const config = Object.freeze({
    port: Number(process.env.PORT) || 3000,
    // ":memory:" no escribe a disco (lo usan los tests).
    dbFile: dbFile === ":memory:" ? dbFile : path.resolve(backendRoot, dbFile),
    adminKey: process.env.ADMIN_KEY || "downtempo-admin",
    corsOrigin: process.env.CORS_ORIGIN || "*"
});
