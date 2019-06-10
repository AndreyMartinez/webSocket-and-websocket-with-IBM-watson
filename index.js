//Library
var express = require('express')
var http = require('http')
var socketIO = require('socket.io')
var app = express();
var server = http.Server(app);
var webSocket = socketIO(server);
const dotenv = require('dotenv');

//modules
var chatModule = require('./src/modules/chatModule')
//Watson 
const AssistantV1 = require('ibm-watson/assistant/v1');
const LanguageTranslatorV3 = require('watson-developer-cloud/language-translator/v3');
const fs = require('fs');


var language; 

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
  * @author Raphael Andrey 
  * @description Variables de asistance Watson 
  */     
  const assistant = new AssistantV1({
      version: process.env.version,
      iam_apikey: process.env.apikey,
      url: process.env.url
  });

/**
 * @author Raphael Martinez
 * @description Está función se encarga de enviar el mensaje que llega al servidor
 * @param {any} message Mensaje que llega del respectivo usuario
 */
function sendIbmWatson(message) {
   return assistant.listWorkspaces()
        .then(function(res) {
        return  assistant.message({
                    workspace_id: res.workspaces[0].workspace_id,
                    input: {
                        'text': message
                    }
                })
                .then(function(message) {
                   return message
                })
                .catch(function(err) {
                    console.log("err")
                });
        })
        .catch(function(err) {
            console.log(err)
        });
}



/**
 * @author Raphael Martinez
 * @description manejo de socket
 */
webSocket.on('connection',function(socket){
    console.log('Se realizo una conexión al web socket ')
     socket.emit('messages',messages)
    console.log(messages)

    socket.on('newMessage',function(data){
        chatModule.translate(data.texto,'user').then(response => {
            sendIbmWatson(response).then(function(response){
                messages = {
                   texto:response.output.text[0],
                   usuario:'Perichat'
                }
                chatModule.translate(messages.texto,messages.usuario).then(response =>{
                    messages.texto= response
                    socket.emit('messages',messages)
                })
              }).catch(function(err){
                       console.log("1")
               })
             }).catch(err => {
                 console.log("2")
             })
    })
})
