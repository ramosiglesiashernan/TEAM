const path = require("path")
const sqlite3 = require("sqlite3")
const dbPath = path.join(__dirname,"..","data","TEAM.db")
const db = new sqlite3.Database(dbPath)

const pos = (process.argv[2] || "").toUpperCase().trim();

if (!pos) {
  console.log("Uso: npm run players:list:byPosition <POSICION>");
  process.exit(1);
}

db.all("SELECT nombre, potencial, partidos, goles, asistencias from players where posicion = (?) ORDER BY nombre ASC", [pos], (err, rows)=>{
    if(err){
        console.error(err.message)
        process.exit(1)
    }

        if(!rows || rows.length == 0){
        console.log("No hay jugadores en el equipo.")
        return
    }

    console.table(rows)
    db.close()

})