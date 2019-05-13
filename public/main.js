var socket = io.connect('http://localhost:3000',{'forceNew':true});
var messageUser =[];


/**
 * @author Raphael Martinez
 * @description socket que toma los valores que vienen de Watson
 * @param {array} data data que trae el respectivo servicio
 */
socket.on('messages',function(data){
    messageUser.push(data)
    renderForm();
})

/**
 * @author Raphael Martinez
 * @description function que toma el respectivo parametro y lo retorna 
 * @param {*} e 
 */
function addMessage(e){
let payload = {
    usuario:"test user",
    texto:document.getElementById('text').value
}
messageUser.push(payload)
renderForm();
socket.emit('newMessage',payload);
document.getElementById('text').value = " "
return false;
}


/**
 * @author Rahpael Martinez
 * @description function que renderiza el contenido en el formulario
 */
function renderForm() {
    let html =  messageUser.map((value,index) => {
        console.log(value)
        return value.usuario == "Perichat" ?
        `<div>
        <div class="generic white-content">
     <p class="texto">
     <strong>${value.usuario}: </strong>
     ${value.texto}
     </p>
     <div class="last"> 18:09</div>
     </div>
     </div>`
    :
    `<div class="black-element">
    <div class="generic black-content">
    <p class="texto">
    <strong>${value.usuario}: </strong>
    ${value.texto}
    </p>
    <div class="last"> 18:09</div>
    </div>
    </div>`
    })
    document.getElementById('newMessage').innerHTML = html
divContent = document.getElementsByClassName('container-message')[0];
divContent.scrollTop = divContent.scrollHeight;
}