var express = require('express')
var http = require('http')
var socketIO = require('socket.io')

var app = express();
var server = http.Server(app);
var webSocket = socketIO(server);
const dotenv = require('dotenv');

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
        translate(data.texto,'user').then(response => {
            sendIbmWatson(response).then(function(response){
                messages = {
                   texto:response.output.text[0],
                   usuario:'Perichat'
                }
                translate(messages.texto,messages.usuario).then(response =>{
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



/**
 * @author Raphael Martinez
 * @description manejo lenguaje
 */
const languageTranslator = new LanguageTranslatorV3({
    version: process.env.version,
    iam_apikey: 'LfsJbtum4UKhmNgVa8T0mj-n77pwovmoPUPJZAKQi7q1',
    url: 'https://gateway.watsonplatform.net/language-translator/api',
    headers: {
        'X-Watson-Learning-Opt-Out': 'true'
      }
  });

  const translateParams = {
    text: '',
  };
  
  function translate(text,user){
    translateParams.text=text
   return languageTranslator.identify(translateParams).then(response => {
    
    //
    if(response.languages[0].language ==="es" && user === "user"){
        console.log('1',response.languages[0].language,user,language)
        language = "es"; 
        return text;
    }
    //
     else if (language ==="es" && user === "Perichat"){
        console.log('2',response.languages[0].language,user,language)
              return text
    }
    //
    else {
        console.log('3',response.languages[0].language,user,language)
        language = user==="user" ? response.languages[0].language : language
    translateParams.model_id = user==="user" ? `${response.languages[0].language}-es` :`es-${language}` 
     console.log(translateParams)
    return  languageTranslator.translate(translateParams)
              .then(translationResult => {
                  console.log(translateParams)
            return    translationResult.translations[0].translation
              })
              .catch(err => {
                console.log(err)
                 createLanguage(translateParams)
              });
            }
            }).catch(err => {
                console.log(err)
  })
  }



  //Create new language

const createModelParams = {
    name: 'custom-pt-es',
    base_model_id: 'pt-es',
    forced_glossary: fs.createReadStream('./glossary.tmx'),
};

function createLanguage(params) {
    console.log("entro"+createModelParams)
    languageTranslator.listModels()
  .then(translationModels => {
    console.log(JSON.stringify(translationModels, null, 2));
  })
  .catch(err => {
    console.log('error:', err);
  }); 
    // .then(translationModel => {
        //     console.log(JSON.stringify(translationModel, null, 2));
        // })
        // .catch(err => {
        //     console.log('error:', err);
        // });

}