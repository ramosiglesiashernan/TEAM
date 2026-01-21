const sqlite3 = require("sqlite3").verbose();
const yargsFactory = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

const DB_PATH = "./data/team.db";

const argv = yargsFactory(hideBin(process.argv))
  .parserConfiguration({ "camel-case-expansion": false })
  .option("nombre", { type: "string", demandOption: true, describe: "Nombre actual del jugador" })
  .option("nuevoNombre", { type: "string", describe: "Nuevo nombre del jugador" })
  .option("posicion", { type: "string", describe: "Nueva posición" })
  .option("potencial", { type: "number", describe: "Nuevo potencial" })
  .option("partidos", { type: "number", describe: "Partidos jugados" })
  .option("goles", { type: "number", describe: "Goles anotados" })
  .option("asistencias", { type: "number", describe: "Asistencias realizadas" })
  .strict()
  .help()
  .parseSync();

const updates = {};
if (argv.nuevoNombre !== undefined) updates.nombre = argv.nuevoNombre;
if (argv.posicion !== undefined) updates.posicion = argv.posicion;
if (argv.potencial !== undefined) updates.potencial = argv.potencial;
if (argv.partidos !== undefined) updates.partidos = argv.partidos;
if (argv.goles !== undefined) updates.goles = argv.goles;
if (argv.asistencias !== undefined) updates.asistencias = argv.asistencias;

if (Object.keys(updates).length === 0) {
  console.error("No has pasado ningún campo a actualizar. Ej: --posicion POR");
  process.exit(1);
}

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error("Error abriendo la base de datos:", err.message);
    process.exit(1);
  }
});

const setClauses = [];
const values = [];

for (const [key, value] of Object.entries(updates)) {
  setClauses.push(`${key} = ?`);
  values.push(value);
}

values.push(argv.nombre);

const sql = `UPDATE players SET ${setClauses.join(", ")} WHERE nombre = ?`;

db.run(sql, values, function (err) {
  if (err) {
    console.error("Error actualizando jugador:", err.message);
    db.close();
    process.exit(1);
  }

  if (this.changes === 0) {
    console.error(`No se encontró ningún jugador con nombre="${argv.nombre}".`);
  } else {
    console.log(`OK: jugador "${argv.nombre}" actualizado. Filas modificadas: ${this.changes}`);
  }

  db.close();
});
