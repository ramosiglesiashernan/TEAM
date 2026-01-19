const path = require("path")
const sqlite3 = require("sqlite3")
const dbPath = path.join(__dirname,"..","data","TEAM.db")
const db = new sqlite3.Database(dbPath)

db.all("SELECT nombre,posicion,potencial,partidos,goles,asistencias FROM players ORDER BY nombre ASC",(err,rows)=>{
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