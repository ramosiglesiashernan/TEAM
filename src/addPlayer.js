const path = require("path")
const sqlite3 = require("sqlite3")
const dbPath = path.join(__dirname,"..","data","TEAM.db")
const db = new sqlite3.Database(dbPath)

const args = process.argv.slice(2)
const [nombre, posicion, potencial] = args

if(!nombre || !posicion || !potencial){
    console.log("Uso: node addPlayer.js <nombre> <posicion> <potencial>")
    console.log("Ejemplo: node addPlayer.js 'NombreJugador' 'POR' '80'")
    process.exit(1)
}

const potencialNum = Number(potencial);
if (!Number.isInteger(potencialNum) || potencialNum < 50 || potencialNum > 99) {
  console.log("Error: POTENCIAL debe ser un entero entre 50 y 99.");
  process.exit(1);
}

const pos = posicion.toUpperCase().trim();

db.run(`INSERT INTO players (nombre, posicion, potencial) VALUES (?,?,?)`, [nombre,pos,potencialNum], (err) => {
    if(err){
        console.error(err.message)
        process.exit(1)
    }
    console.log(`Jugador agregado correctamente: ${nombre} - ${pos} - ${potencialNum}`)
    db.close()
})
