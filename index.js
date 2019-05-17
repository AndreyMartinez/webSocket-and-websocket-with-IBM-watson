var express = require('express')
var http = require('http')
var socketIO = require('socket.io')
const AssistantV1 = require('ibm-watson/assistant/v1');

var app = express();
var server = http.Server(app);
var webSocket = socketIO(server);
const dotenv = require('dotenv');


var messages = []


dotenv.config();
app.use(express.static('./public'))

server.listen(process.env.PORT || 1337,function() {
     console.log("server run port 1337")}
     )
     
     app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*"); 
        res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
        res.header("Access-Control-Allow-Headers", "Content-type,Accept,X-Custom-Header");
      if (req.method === "OPTIONS") {
            return res.status(200).end();
        }
        next();
      });
  const assistant = new AssistantV1({
      version: process.env.version,
      iam_apikey: process.env.apikey,
      url: process.env.url
  });


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
                    console.log(err)
                });
        })
        .catch(function(err) {
            console.log(err)
        });
}



// Generación de socket 
webSocket.on('connection',function(socket){
    console.log('Se realizo una conexión al web socket ')
    socket.emit('messages',messages)

    socket.on('newMessage',function(data){
        sendIbmWatson(data.texto).then(function(response){
            console.log(response)
         messages = {
            texto:response.output.text[0],
            usuario:'Perichat'
         }
         console.log('second')
        socket.emit('messages',messages)
        }).catch(function(err){
                
        })
    })
})