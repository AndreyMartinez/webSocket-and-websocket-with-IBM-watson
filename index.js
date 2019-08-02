//Library
var express = require('express')
var http = require('http')
var socketIO = require('socket.io')
var app = express();
var server = http.Server(app);
var webSocket = socketIO(server);
const dotenv = require('dotenv');

//modules
var chatModule = require('./src/modules/chatTranslateModule')
var chatWatson = require('./src/modules/chatSocketWatsonModule')

var messages = []


dotenv.config();
app.use(express.static('./public'))

/**
 * @author Raphael Andrey Martinez
 * @description Inicialización de servidor por el respectivo puerto
 */
server.listen(process.env.PORT || 1337,function() {
     console.log("server run port 1337")}
     )
     

     /**
      * @author Raphael Andrey Martinez
      * @description evitar problema de CORS
      */
     app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*"); 
        res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
        res.header("Access-Control-Allow-Headers", "Content-type,Accept,X-Custom-Header");
      if (req.method === "OPTIONS") {
            return res.status(200).end();
        }
        next();
      });

/**
 * @author Raphael Martinez
 * @description manejo de socket
 */
webSocket.on('connection',function(socket){
    console.log('Se realizo una conexión al web socket ')
     socket.emit('messages',messages)
     socket.on('newMessage',function(data){
        chatModule.translate(data.texto,'user').then(response => {
            chatWatson.sendDataIbmWatson(socket,response)
             }).catch(err => {
                 console.log(err)
             })
    })
})
