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

        this.socketsClients.set(ws, []); 
        console.log("current players: " + this.socketsClients.size);


        // Send clients list to everyone
        this.sendClients();

        // What to do when a client is disconnected
        ws.on("close", () => { this.checkDisconnectCurrentConnections(ws, id)})
        console.log(id);
        // What to do when a client message is received
        ws.on('message', (bufferedMessage) => { this.newMessage(ws, id, bufferedMessage)})
        //ws.on('message', (bufferedMessage) => { console.log(bufferedMessage);})
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
            // if (client.readyState === WebSocket.OPEN) {
            //     var messageAsString = JSON.stringify(obj)
            //     client.send(messageAsString)
            // }
            var messageAsString = JSON.stringify(obj)
            client.send(messageAsString)
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
        
        console.log("PRINT: " + messageAsString);

        try { messageAsObject = JSON.parse(messageAsString) } 
        catch (e) { console.log("Could not parse bufferedMessage from WS message") }

        //Registrar conexion
        switch(messageAsObject.type){

            case "newUser": //Cuando se conecte un user, si se ha contectado tiene que enviar esto: 
                var nom = messageAsObject.nom;
                var cicle = messageAsObject.cicle;
                console.log("hola");
                this.addNewConectionToDB(nom, cicle, id);

            break;
            case "remove_totem": //Usa la id_totem para eliminar un totem, pero desde el cliente de momento se envia el json del totem entero.

                var totemToRemoveId = messageAsObject.totemId;
                var index = -1;
                var result;
            
                for(let i = 0; i < this.totemArray.length; i++){
                    if(this.totemArray[i].id_totem === totemToRemoveId){
                        index = i;
                    }
                }

                console.log("Index: " + index);
                if (index !== -1) {
                    this.totemArray.splice(index, 1);
                    result = {type:"deleteTotemId", totem_eliminat: totemToRemoveId};

                }else{
                    result = {status:"KO", totem_eliminat: "Totem no eliminat"};
                }
                

                ws.send(JSON.stringify(result));

                console.log("\n\nArray de totems sin el totem eliminado: ");
                for(let i = 0; i < this.totemArray.length; i++){
                    console.log("ID ocupacio: " + this.totemArray[i].id);
                    console.log("Nom ocupacio: " + this.totemArray[i].nom);
                    console.log("Id cicle: " + this.totemArray[i].id_cicles);
                    console.log("Id totem: " + this.totemArray[i].id_totem);
                    console.log("============================================================")
                }
                
            break;
            case "playerPosition": //PlayerName,playerPos. 
                var position = messageAsObject;
                
                ws.send(JSON.stringify(position));
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
            const fecha = new Date();
            const opciones = { timeZone: "Europe/Madrid" };
            const fechaEspaña = fecha.toLocaleString("es-ES", opciones);
            const fechaSQL = fechaEspaña.replace(/(\d+)\/(\d+)\/(\d+), (\d+):(\d+):(\d+)/, "$3-$2-$1 $4:$5:$6");
       
            await this.db.query("insert into CONNEXIONS(nom, cicle, connectionId, connectat) values('" + nom +"', " + cicle +", '" + id.toString() +"', '"+ fechaSQL +"');");
            console.log("conexion añadida");
            await this.recalculateTotems(cicle);
        }catch(error){
            console.log(error);
        }
    }


    async recalculateTotems(cicle){
        try{

            var currentPlayersCount = this.socketsClients.size;
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

                    var totemPosX = Math.floor(Math.random() * 800);
                    var totemPosY = Math.floor(Math.random() * 450);

                    if(i < 5){

                        let totemId = this.generateTotemId();
                        let correctTotemResult = {"id":correctTotems[i].id, "nom":correctTotems[i].nom, "id_cicles":correctTotems[i].id_cicles, "id_totem": totemId, "posX":totemPosX, "posY":totemPosY};
                        this.totemArray.push(correctTotemResult);

                    }else{

                        let totemId = this.generateTotemId();
                        let correctTotemResult = {"id":incorrectTotems[i].id, "nom":incorrectTotems[i].nom, "id_cicles":incorrectTotems[i].id_cicles, "id_totem": totemId,  "posX":totemPosX, "posY":totemPosY};
                        this.totemArray.push(correctTotemResult);
                    }
                }

                for(let i = 0; i < this.totemArray.length; i++){
                    console.log("ID ocupacio: " + this.totemArray[i].id);
                    console.log("Nom ocupacio: " + this.totemArray[i].nom);
                    console.log("Id cicle: " + this.totemArray[i].id_cicles);
                    console.log("Id totem: " + this.totemArray[i].id_totem);
                    console.log("============================================================")
                }

                //Send totems to all clients: 
                let totemsJson = {type:"recibeTotems", totems: this.totemArray};
                this.broadcast(totemsJson);

            }else{

                //Sacar correctos
                let correctTotems = await this.db.query("select id, nom, id_cicles from OCUPACIONS where id_cicles = " + cicle + " order by RAND();");

                //Sacar incorrectos
                let incorrectTotems = await this.db.query("select id, nom, id_cicles from OCUPACIONS where id_cicles <> " + cicle + " order by RAND();");

                //Añadir a la lista de totems: 
                for(let i = 0; i < 10; i++){
                    if(i < 5){

                        let totemId = this.generateTotemId();
                        let correctTotemResult = {"id":correctTotems[i].id, "nom":correctTotems[i].nom, "id_cicles":correctTotems[i].id_cicles, "id_totem": totemId};
                        this.totemArray.push(correctTotemResult);

                    }else{

                        let totemId = this.generateTotemId();
                        let correctTotemResult = {"id":incorrectTotems[i].id, "nom":incorrectTotems[i].nom, "id_cicles":incorrectTotems[i].id_cicles, "id_totem": totemId};
                        this.totemArray.push(correctTotemResult);
                    }
                }

                for(let i = 0; i < this.totemArray.length; i++){
                    console.log("ID ocupacio: " + this.totemArray[i].id);
                    console.log("Nom ocupacio: " + this.totemArray[i].nom);
                    console.log("Id cicle: " + this.totemArray[i].id_cicles);
                    console.log("============================================================")
                }

                //Send totems to all clients: 
                let totemsJson = {type:"recibeTotems", totems: this.totemArray};
                this.broadcast(totemsJson);
            }

        }catch(error){
            console.log(error);
        }
    }


    async checkDisconnectCurrentConnections(ws, id){

        this.socketsClients.delete(ws)

        const fecha = new Date();
        const opciones = { timeZone: "Europe/Madrid" };
        const fechaEspaña = fecha.toLocaleString("es-ES", opciones);
        const fechaSQL = fechaEspaña.replace(/(\d+)\/(\d+)\/(\d+), (\d+):(\d+):(\d+)/, "$3-$2-$1 $4:$5:$6");

        try{
            await this.db.query("update CONNEXIONS set desconnectat = '"+ fechaSQL +"' where connectionId = '"+ id +"';");
            console.log("desconnexion actualizada");

            var currentPlayersCount = this.socketsClients.size;

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


    generateTotemId(){
        let charsList = [];
        let tokenSize = 10;
        let token = "T";

        for(let i = 0; i < 10; i ++){
            charsList.push(i);
        }

        for(let i = 65; i <= 90; i++) {
            charsList.push(String.fromCharCode(i));
        }

        for(let i = 97; i <= 122; i++) {
            charsList.push(String.fromCharCode(i));
        }
        
        for(let i = 0; i < tokenSize - 1; i++){
            let randomNum = Math.round(Math.random()*(charsList.length - 1));
            token += charsList[randomNum];
        }

        return token;
    }

}

module.exports = Obj

