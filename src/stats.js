const path = require("path");
const sqlite3 = require("sqlite3");

const dbPath = path.join(__dirname, "..", "data", "TEAM.db");
const db = new sqlite3.Database(dbPath);

db.serialize(()=>{
    //Pichichi
    db.get("Select nombre, posicion, goles from players order by goles desc, nombre asc limit 1", (err,goleador)=>
    {
        if(err){
            console.error("Error al obtener el pichichi:", err.message);
            process.exit(1);
        }
        if(!goleador || goleador.goles == 0){
            console.log("No hay datos de goles para mostrar el Pichichi.");
        }
        else{
            console.log(`🏆 Pichichi: ${goleador.nombre} - Posición: ${goleador.posicion} - Goles: ${goleador.goles}`);
        }
    })
    // Asistente
    db.get("Select nombre, posicion, asistencias from players order by asistencias desc, nombre asc limit 1", (err, asistencias) =>{
        if(err){
            console.log("Erro al obtener el asistente", err,err.message)
            process.exit(1)
        }
        if(!asistencias || asistencias.asistencias == 0){{

        }console.log("No hay datos de asistencias para mostrar el Asistente.");
        }
        else{
            console.log(`🏆 Asistente: ${asistencias.nombre} - Posición: ${asistencias.posicion} - Asistencias: ${asistencias.asistencias}`);
        }

        db.close
    })
})