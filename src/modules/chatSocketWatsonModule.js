
const AssistantV1 = require('ibm-watson/assistant/v1');

//modules 
const chatTranslate = require('./chatTranslateModule') 

/**
  * @author Raphael Andrey 
  * @description Variables de asistance Watson 
  */     
 const assistant = new AssistantV1({
    version: process.env.version,
    iam_apikey: process.env.apikey,
    url: process.env.url
});


function sendDataIbmWatson(socket,response){
   sendIbmWatson(response).then(function(response){
    messages = {
       texto:response.output.text[0],
       usuario:'Perichat'
    }
    chatTranslate.translate(messages.texto,messages.usuario).then(response =>{
        messages.texto= response
        socket.emit('messages',messages)
    })
  }).catch(function(err){
           console.log("1")
   })
}

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
             console.log('err')
         });
 }


 module.exports = {
    sendDataIbmWatson:sendDataIbmWatson
 }