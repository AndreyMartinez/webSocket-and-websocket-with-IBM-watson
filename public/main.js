var socket = io.connect('http://localhost:3000',{'forceNew':true});
var messageUser =[];


socket.on('messages',function(data){
    render(data);
})

function render(data){
    let html = 
    data.map((value,index)=>{
      return `<div>
    <strong>${value.usuario}</strong>
    ${value.texto}
    </div>
    `})
    document.getElementById('messages').innerHTML = html
    
}

function addMessage(e){
let payload = {
    usuario:"test user",
    texto:document.getElementById('text').value
}
messageUser.push(payload)
let html =  messageUser.map((value,index) => {
    return `<div>
    <strong>${value.usuario}</strong>
            ${value.texto}
    </div>`
})
document.getElementById('newMessage').innerHTML = html
socket.emit('newMessage',payload);
return false;
}