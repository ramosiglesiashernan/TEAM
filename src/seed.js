const path = require("path") // path
const sqlite3 = require("sqlite3") // sqlite3
const dbPath = path.join(__dirname,"..","data","TEAM.db") // Ruta a la .db
const db = new sqlite3.Database(dbPath) // Abro

db.serialize(() => {

  db.run(`INSERT OR IGNORE INTO players (nombre, posicion, potencial, partidos, goles, asistencias) VALUES
    ('Pedri', 'MC', 88, 0, 0, 0),
    ('Koundé', 'DFC', 84, 0, 0, 0),
    ('Roony', 'EXT', 72, 0, 0, 0),
    ('Joan', 'POR', 83, 0, 0, 0)`)

    console.log("Base de datos inicializada")

  })

  db.close() 

