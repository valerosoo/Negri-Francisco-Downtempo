// Tiene que ser el PRIMER import de cada archivo de test: configura el
// entorno antes de que se cargue el store, para que los tests corran contra
// una base en memoria y no toquen backend/data/db.json.
process.env.DB_FILE = ":memory:";
process.env.ADMIN_KEY = "clave-de-test";
