var express = require('express')
var http = require('http')
var socketIO = require('socket.io')


var app = express();
var server = http.Server(app);
var webSocket = socketIO(server);


var messages = [
    {
        id:1,
        texto:'hola bienvenido a mi pagina web',
        usuario:'Raphael Martinez' 
    }
]
app.use(express.static('./public'))

server.listen(3000,() => console.log("server run port 3000"))


//Generación de socket 
webSocket.on('connection',(socket) => {
    console.log('Se realizo una conexión al web socket ')
    socket.emit('messages',messages)

    socket.on('newMessage',function(data){
        messages.push({
            id:2,
            texto:'En que puedo ayudarte',
            usuario:'Raphael Martinez'
        })
        socket.emit('messages',messages)
    })
})