const path = require('path')
const sqlite3 = require('sqlite3')
const dbPath = path.join(__dirname, '..', 'data', 'TEAM.db')
const db = new sqlite3.Database(dbPath)

db.serialize(() => {
    db.run("DROP TABLE IF EXISTS players");

    db.run( `  CREATE TABLE IF NOT EXISTS players (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      posicion TEXT NOT NULL,
      potencial INTEGER NOT NULL,
      partidos INTEGER NOT NULL DEFAULT 0,
      goles INTEGER NOT NULL DEFAULT 0,
      asistencias INTEGER NOT NULL DEFAULT 0,
      UNIQUE(nombre,posicion)
    )`, (err) => {
        if(err){
            console.error(err.message)
            process.exit(1)
        }
        console.log("Tabla creada correctamente")
        db.close()
    })
})
