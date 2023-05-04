/*
Desde el cliente se tiene que conectar y si puede conectarse enviar un json con los datos ej: {"type": "newUser", "nom":"Jordi", "cicle":"1"}
*/

const WebSocket = require('ws')
const { v4: uuidv4 } = require('uuid')

class Obj {

    init (httpServer, port, db) {

        // Set reference to database
        this.db = db

        //Lista de clientes conectados
        this.clients = [] 

        // Run WebSocket server
        this.wss = new WebSocket.Server({ server: httpServer })
        this.socketsClients = new Map()
        console.log(`Listening for WebSocket queries on ${port}`)

        // What to do when a websocket client connects
        this.wss.on('connection', (ws) => { this.newConnection(ws) })
    }

    end () {
        this.wss.close()
    }

    // A websocket client connects
    newConnection (ws) {

        console.log("Client connected")

        // Add client to the clients list
        const id = uuidv4()
        const color = Math.floor(Math.random() * 360)
        const metadata = { id, color }
        this.socketsClients.set(ws, metadata); 
        
        // Send clients list to everyone
        this.sendClients();

        // What to do when a client is disconnected
        ws.on("close", () => { this.checkDisconnectCurrentConnections(ws, id)})

        // What to do when a client message is received
        ws.on('message', (bufferedMessage) => { this.newMessage(ws, id, bufferedMessage)})
    }

    // Send clientsIds to everyone connected with websockets
    sendClients () {

        this.wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                var id = this.socketsClients.get(client).id
                var messageAsString = JSON.stringify({ type: "clients", id: id, currentClients: this.socketsClients.size})
                client.send(messageAsString)
            }
        })
    }
  
    // Send a message to all websocket clients
    broadcast (obj) {
        this.wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                var messageAsString = JSON.stringify(obj)
                client.send(messageAsString)
            }
        })
    }
  
    // Send a private message to a specific websocket client
    private (obj) {
        this.wss.clients.forEach((client) => {
            if (this.socketsClients.get(client).id == obj.destination && client.readyState === WebSocket.OPEN) {
                var messageAsString = JSON.stringify(obj)
                client.send(messageAsString)
                return
            }
        })
    }


    // A message is received from a websocket client
    newMessage (ws, id, bufferedMessage) {

        var messageAsString = bufferedMessage.toString()
        var messageAsObject = {}
            
        try { messageAsObject = JSON.parse(messageAsString) } 
        catch (e) { console.log("Could not parse bufferedMessage from WS message") }


        switch(messageAsObject.type){

            case "newUser": //Cuando se conecte un user, si se ha contectado tiene que enviar esto: 
                var nom = messageAsObject.nom;
                var cicle = messageAsObject.cicle;
                console.log("nom: " + nom + ", cicle: " + cicle);

                this.addNewConectionToDB(nom, cicle, id);

            break;
        }


        // if (messageAsObject.type == "bounce") {
        //     var rst = { type: "bounce", message: messageAsObject.message }
            
        //     ws.send(JSON.stringify(rst))

        // } else if (messageAsObject.type == "broadcast") {

        //     var rst = { type: "broadcast", origin: id, message: messageAsObject.message }
        //     this.broadcast(rst)

        // } else if (messageAsObject.type == "private") {

        //     var rst = { type: "private", origin: id, destination: messageAsObject.destination, message: messageAsObject.message }
        //     this.private(rst)
        // }
    }


    async addNewConectionToDB(nom, cicle, id){
        try{
            await this.db.query("insert into CONNEXIONS(nom, cicle, connectionId) values('" + nom +"', " + cicle +", '" + id.toString() +"');");
            console.log("conexion añadida");
            await this.recalculateTotems(cicle);
        }catch(error){
            console.log(error);
        }
    }


    async recalculateTotems(cicle){
        try{
            let data = await this.db.query("select COUNT(id) as count from CONNEXIONS;");
            var currentPlayersCount = data[0].count;
            console.log("current conexions: " + currentPlayersCount);
            
            if(currentPlayersCount == 1){

                //Array de Jsons
                this.totemArray = [];
                
                //Sacar correctos
                let correctTotems = await this.db.query("select id, nom, id_cicles from OCUPACIONS where id_cicles = " + cicle + " order by RAND();");

                //Sacar incorrectos
                let incorrectTotems = await this.db.query("select id, nom, id_cicles from OCUPACIONS where id_cicles <> " + cicle + " order by RAND();");

                //Añadir a la lista de totems: 
                for(let i = 0; i < 10; i++){
                    if(i < 5){

                        this.totemArray.push(correctTotems[i]);

                    }else{

                        this.totemArray.push(incorrectTotems[i]);
                    }
                }

                for(let i = 0; i < this.totemArray.length; i++){
                    console.log("ID ocupacio: " + this.totemArray[i].id);
                    console.log("Nom ocupacio: " + this.totemArray[i].nom);
                    console.log("Id cicle: " + this.totemArray[i].id_cicles);
                    console.log("============================================================")
                }

                //Send totems to all clients: 
                let totemsJson = {totems: this.totemArray};
                this.broadcast(totemsJson);

            }else{

                //Sacar correctos
                let correctTotems = await this.db.query("select id, nom, id_cicles from OCUPACIONS where id_cicles = " + cicle + " order by RAND();");

                //Sacar incorrectos
                let incorrectTotems = await this.db.query("select id, nom, id_cicles from OCUPACIONS where id_cicles <> " + cicle + " order by RAND();");

                //Añadir a la lista de totems: 
                for(let i = 0; i < 10; i++){
                    if(i < 5){

                        this.totemArray.push(correctTotems[i]);

                    }else{

                        this.totemArray.push(incorrectTotems[i]);
                    }
                }

                for(let i = 0; i < this.totemArray.length; i++){
                    console.log("ID ocupacio: " + this.totemArray[i].id);
                    console.log("Nom ocupacio: " + this.totemArray[i].nom);
                    console.log("Id cicle: " + this.totemArray[i].id_cicles);
                    console.log("============================================================")
                }

                //Send totems to all clients: 
                let totemsJson = {totems: this.totemArray};
                this.broadcast(totemsJson);
            }

        }catch(error){
            console.log(error);
        }
    }


    async checkDisconnectCurrentConnections(ws, id){

        this.socketsClients.delete(ws)

        try{
            await this.db.query("delete from CONNEXIONS where connectionId = '"+ id +"';");
            console.log("conexion eliminada");

            let data = await this.db.query("select COUNT(id) as count from CONNEXIONS;");
            var currentPlayersCount = data[0].count;

            if(currentPlayersCount == 0)
            {
                console.log("sin jugadores");
                this.totemArray = []; //Clean totems

            }else{
                console.log("Quedan " + currentPlayersCount + " jugadores");
            }

        }catch(error){
            console.log("checkCurrentConnections error: " + error);
        }
    }


}

module.exports = Obj

