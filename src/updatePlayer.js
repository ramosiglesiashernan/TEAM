import yargs from "yargs";
import { hideBin } from "yargs/helpers";

const argv = yargs(hideBin(process.argv))
.option("nombre",{type: "string", demadOption: true, describe: "Nombre del jugador"})
.option("nuevoNombre",{type: "string", describe: "Nuevo nombre del jugador"})
.option("posicion",{type: "string", describe: "Posicion"})
.option("goles",{type: "number", describe: "Goles anotados"})
.option("partidos", {type: "number", describe: "Partidos jugados"})
.option("asistencias", {type: "number", describe: "Asistencias realizadas"})
.option("potencial", {type: "number", describe: "Potencial del jugador"})
.strict()
.help()
.parse();

const updates = {};
if (argv.nuevoNombre !== undefined) updates.nuevoNombre = argv.nuevoNombre;
if (argv.posicion !== undefined) updates.posicion = argv.posicion;
if (argv.potencial !== undefined) updates.potencial = argv.potencial;
if (argv.partidos !== undefined) updates.partidos = argv.partidos;
if (argv.goles !== undefined) updates.goles = argv.goles;
if (argv.asistencias !== undefined) updates.asistencias = argv.asistencias;

if (Object.keys(updates).length === 0) {
  console.error("No has pasado ningún campo a actualizar. Ej: --pos POR");
  process.exit(1);
}

// Ejemplo: tu función de update real
console.log("Jugador a modificar:", argv.name);
console.log("Campos a actualizar:", updates);

