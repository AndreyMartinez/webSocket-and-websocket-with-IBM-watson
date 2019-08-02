const chatTranslate = require("./chatTranslateModule")

//ESPAÑOL

test('Traducción de idioma español del usuario',()=>{
   chatTranslate.translate('texto','user').then(response => {
       expect(response).toBe('texto')
    })
})



test('Generación de respuesta del chatBoot,Según el idioma que tiene el usuario',()=>{
    chatTranslate.translate('texto','Perichat').then(response => {
        expect(response).toBe('texto')
    })
})


//Ingles
test('Generación de traducción del idioma del usuario',() => {
    chatTranslate.translate('text','user').then(response => {
     expect(response).toBe('texto')
    })
})

test('Generación de traducción del perichat al actual idioma que tiene,'+
  'la secuencia de test dice que se tiene ingles',()=> {
    chatTranslate.translate('texto','Perichat').then(response => {
        expect(response).toBe('text')
       })
})