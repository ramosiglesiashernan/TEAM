const path = require("path");
const sqlite3 = require("sqlite3");

const dbPath = path.join(__dirname, "..", "data", "TEAM.db");
const db = new sqlite3.Database(dbPath);

// Flags: --minPartidos=5 --pos=DEL --limit=10
const rawArgs = process.argv.slice(2);
const flags = Object.fromEntries(
  rawArgs
    .filter(a => a.startsWith("--") && a.includes("="))
    .map(a => {
      const [k, v] = a.slice(2).split("=");
      return [k, v];
    })
);

const minPartidos = Number(flags.minPartidos ?? 0);
const pos = flags.pos ? String(flags.pos).toUpperCase() : null;
const limit = flags.limit ? Number(flags.limit) : null;

db.all("SELECT nombre, posicion, partidos, goles, asistencias FROM players", (err, rows) => {
  if (err) {
    console.error("Error leyendo jugadores:", err.message);
    process.exit(1);
  }

  if (!rows || rows.length === 0) {
    console.log("No hay jugadores en el equipo.");
    db.close();
    return;
  }

  let filtered = rows.filter(r => r.partidos > 0);

  if (!Number.isNaN(minPartidos) && minPartidos > 0) {
    filtered = filtered.filter(r => r.partidos >= minPartidos);
  }

  if (pos) {
    filtered = filtered.filter(r => String(r.posicion).toUpperCase() === pos);
  }

  if (filtered.length === 0) {
    console.log("No hay resultados con esos filtros.");
    db.close();
    return;
  }

  const scored = filtered.map(r => {
    const posicion = String(r.posicion).toUpperCase();
    const partidos = r.partidos;
    const goles = r.goles ?? 0;
    const asistencias = r.asistencias ?? 0;

    // Caso PORTERO
    if (posicion === "POR") {
      // Si guardas encajados como goles negativos (ej: -10), esto lo recupera.
      const encajados = goles < 0 ? Math.abs(goles) : 0;
      const p_encajar = encajados / partidos;

      // score alto=mejor: usamos el negativo de la tasa (menor tasa => mayor score)
      const score_portero = -p_encajar;

      return {
        nombre: r.nombre,
        posicion,
        partidos,
        "encajados (abs goles<0)": encajados,
        "p(encajar/partido)": Number(p_encajar.toFixed(4)),
      };
    }

    // Caso JUGADOR DE CAMPO (Poisson)
    const lambdaGol = goles / partidos;
    const lambdaAsist = asistencias / partidos;
    const lambdaContrib = (goles + asistencias) / partidos;

    const p_gol_1plus = 1 - Math.exp(-lambdaGol);
    const p_asist_1plus = 1 - Math.exp(-lambdaAsist);
    const score_aporte = p_gol_1plus + p_asist_1plus;

    const p_contrib_1plus = 1 - Math.exp(-lambdaContrib);

    return {
      nombre: r.nombre,
      posicion,
      partidos,
      goles,
      asistencias,
      "p(>=1 gol)": Number(p_gol_1plus.toFixed(4)),
      "p(>=1 asist)": Number(p_asist_1plus.toFixed(4)),
      "score aporte (0..2)": Number(score_aporte.toFixed(4)),
      "p(>=1 contrib)": Number(p_contrib_1plus.toFixed(4)),
    };
  });

  // Ordenación:
  // - Si es ranking mixto, ponemos primero jugadores de campo por score, y porteros por menor p_encajar.
  // - Si filtras por --pos=POR, ordena solo por porteros (menor encajar primero).
  scored.sort((a, b) => {
    const aIsPor = a.posicion === "POR";
    const bIsPor = b.posicion === "POR";

    // Si ambos son POR: menor p_encajar primero
    if (aIsPor && bIsPor) {
      if (a["p(encajar/partido)"] !== b["p(encajar/partido)"]) {
        return a["p(encajar/partido)"] - b["p(encajar/partido)"];
      }
      if (b.partidos !== a.partidos) return b.partidos - a.partidos;
      return String(a.nombre).localeCompare(String(b.nombre));
    }

    // Si ambos son de campo: mayor score aporte primero
    if (!aIsPor && !bIsPor) {
      if (b["score aporte (0..2)"] !== a["score aporte (0..2)"]) {
        return b["score aporte (0..2)"] - a["score aporte (0..2)"];
      }
      if (b.partidos !== a.partidos) return b.partidos - a.partidos;
      return String(a.nombre).localeCompare(String(b.nombre));
    }

    // Si se mezclan POR y campo:
    // Por defecto, dejamos primero jugadores de campo y luego porteros.
    // (Si prefieres lo contrario, invierte el return).
    return aIsPor ? 1 : -1;
  });

  const output =
    limit && !Number.isNaN(limit) && limit > 0
      ? scored.slice(0, limit)
      : scored;

  console.log("📈 Ranking (campo: score aporte alto mejor | POR: p encajar bajo mejor)");
  console.log(
    `Filtros: minPartidos=${minPartidos}${pos ? `, pos=${pos}` : ""}${limit ? `, limit=${limit}` : ""}`
  );
  console.table(output);

  db.close();
});
