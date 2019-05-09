var express = require('express')
var http = require('http')
var socketIO = require('socket.io')
const AssistantV1 = require('ibm-watson/assistant/v1');

var app = express();
var server = http.Server(app);
var webSocket = socketIO(server);


var messages = []



app.use(express.static('./public'))

server.listen(3000,() => console.log("server run port 3000"))


  const assistant = new AssistantV1({
      version: '2019-02-28',
      iam_apikey: '*',
      url: '*'
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
                .then(message => {
                   return message
                })
                .catch(err => {
                    console.log(err)
                });
        })
        .catch(err => {
            console.log(err)
        });
}



// Generación de socket 
webSocket.on('connection',(socket) => {
    console.log('Se realizo una conexión al web socket ')
    socket.emit('messages',messages)

    socket.on('newMessage',function(data){
        sendIbmWatson(data.texto).then(response => {
            console.log(response)
         messages.push({
            texto:response.output.text[0],
            usuario:'Raphael Martinez'
         })
         console.log('second')
        socket.emit('messages',messages)
        }).catch(err => {
                
        })
    })
})