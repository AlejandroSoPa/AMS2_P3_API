const express     = require('express')
const fs          = require('fs').promises
const webSockets  = require('./appWS.js')
const post        = require('./utilsPost.js')
const database    = require('./utilsMySQL.js')

var db = new database()   // Database example: await db.query("SELECT * FROM test")
var ws = new webSockets()

// Start HTTP server
const app = express()
const port = process.env.PORT || 3000

// Publish static files from 'public' folder
app.use(express.static('public'))

// Activate HTTP server
const httpServer = app.listen(port, appListen)
function appListen () {
  console.log(`Listening for HTTP queries on: http://localhost:${port}`)
}

// Close connections when process is killed
process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);
function shutDown() {
  console.log('Received kill signal, shutting down gracefully');
  httpServer.close()
  db.end()
  ws.end()
  process.exit(0);
}


// db init
db.init({
  host: process.env.MYSQLHOST || "containers-us-west-160.railway.app",
  port: process.env.MYSQLPORT || 7414,
  user: process.env.MYSQLUSER || "root",
  password: process.env.MYSQLPASSWORD || "oLFYCX0nhLfC7hiy582C",
  database: process.env.MYSQLDATABASE || "railway"
})
ws.init(httpServer, port, db)


function wait (ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

app.post('/api/set_record', setRecord)
async function setRecord (req, res) {

  let receivedPOST = await post.getPostObject(req)
  let result = { status: "ERROR", message: "Unkown type" }

  if(receivedPOST){
    let encertValue = 1;
    let erradesValue = 1;
    let score = 0;
    score += (receivedPOST.encerts * encertValue);
    score -= (receivedPOST.errades * erradesValue);
    if(score < 0){
      score = 0;
    }

    try{
      await db.query("insert into RANKING(username, puntuacio, temps, encerts, errades, id_cicle) values('" + receivedPOST.username +"', "+ score +", "+ receivedPOST.temps +", "+ receivedPOST.encerts +", "+ receivedPOST.errades +", "+ receivedPOST.id_cicle +");");
      result = {status: "OK", message: "Ranking inserted done"}
    }catch(error){
      result = {status: "ERROR", message: ":("}
      console.log('no funsionó: ' + error);
    }
    
  }

  res.writeHead(200, {'Content-Type': 'application/json' })
  res.end(JSON.stringify(result))
}



app.post('/api/get_ranking', getRanking)
async function getRanking (req, res) {

  let receivedPOST = await post.getPostObject(req)
  let result = { status: "ERROR", message: "Unkown type" }

  if (receivedPOST) {
    var data = await db.query("SELECT id, username, puntuacio, temps, encerts, errades, ocult FROM RANKING ORDER BY puntuacio DESC LIMIT 20;")
    console.log(data);
    await wait(500)
    if (data.length > 0) {
      result = { status: "OK", result: data }
    }
  }

  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(result))
}


app.post('/api/set_ocult', setOcult)
async function setOcult (req, res) {

  let receivedPOST = await post.getPostObject(req)
  let result = { status: "ERROR", message: "Unkown type" }

  if (receivedPOST) {

    try{
  
      await db.query("update RANKING set ocult = true where id = " + receivedPOST.rankingId + ";")
      result = { status: "OK", result: ":)" }
      console.log("ok");

    }catch(error){
      result = { status: "KO", result: ":(" }
      console.log("ko");
    }
    
  }

  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(result))
}

app.post('/api/get_cicle', getCicle)
async function getCicle (req, res) {

  let receivedPOST = await post.getPostObject(req)
  let result = { status: "ERROR", message: "Unkown type" }

  if(receivedPOST){

    try{
      var data = await db.query("select id from CICLES where nom = '" + receivedPOST.nomCicle + "');");
      console.log(data);
      result = {status: "OK", message: data}
      console.log('funsionó');
    }catch(error){
      result = {status: "ERROR", message: ":("}
      console.log('no funsionó: ' + error);
    }
    
  }
  
  res.writeHead(200, {'Content-Type': 'application/json' })
  res.end(JSON.stringify(result))
}
