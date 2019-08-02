const LanguageTranslatorV3 = require('watson-developer-cloud/language-translator/v3');
const AssistantV1 = require('ibm-watson/assistant/v1');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();




/**
 * @description Configuraciones de autenticación 
 */
const languageTranslator = new LanguageTranslatorV3({
    version: process.env.version,
    iam_apikey: 'LfsJbtum4UKhmNgVa8T0mj-n77pwovmoPUPJZAKQi7q1',
    url: 'https://gateway.watsonplatform.net/language-translator/api',
    headers: {
        'X-Watson-Learning-Opt-Out': 'true'
    }
});


const createModelParams = {
    name: 'custom-pt-es',
    base_model_id: 'pt-es',
    forced_glossary: fs.createReadStream('./glossary.tmx'),
};


var language; 
const translateParams = {
    text: '',
};



/**
 * @description Función que se encarga de realizar valiación de tipo de texto y traducción del mismo
 * @param {*} text: Texto del usuario 
 * @param {*} user : Usuario que envia el texto
 */
function translate (text, user) {
     translateParams.text = text
    return languageTranslator.identify(translateParams).then(response => {
        if (response.languages[0].language === "es" && user === "user") {
            language = "es";
            return text;
        } else if (language === "es" && user === "Perichat") {
            return text
        } else {
            language = user === "user" ? response.languages[0].language : language
            translateParams.model_id = user === "user" ? `${response.languages[0].language}-es` : `es-${language}`
            return languageTranslator.translate(translateParams)
                .then(translationResult => {
                    return translationResult.translations[0].translation
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




/**
 * @author Raphael Martinez 
 * @description Función que busca agregar un nuevo idioma a las configuraciones de IBM Watson
 * @param {*} params 
 */
  function createLanguage (params) {
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



module.exports = {
    createLanguage:createLanguage,
    translate:translate
}