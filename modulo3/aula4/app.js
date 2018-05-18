var builder = require('botbuilder');
var restify = require('restify');
var request = require('request')

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Crie um chat conector para se comunicar com o Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

//var connector = new builder.ConsoleConnector().listen();
var bot = new builder.UniversalBot(connector);
// Register in-memory state storage
bot.set('storage', new builder.MemoryBotStorage());
// Endpoint que irá monitorar as mensagens do usuário
server.post('/api/messages', connector.listen());

var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/5d3a0f7c-6b27-4477-9aec-975eab52a845?subscription-key=32646e830d494df680529b8cd5e13c77&verbose=true&timezoneOffset=-180&q=')
var intents = new builder.IntentDialog({
    recognizers: [recognizer]
})

intents.onDefault((session, args) => {
    session.send('Desculpe, não entendi');
});

intents.matches('Sobre', (session, args) => {
    session.send('Olá, eu sou um bot!')
});

intents.matches('Cotação', (session, args) => {
    var moedas = builder.EntityRecognizer.findAllEntities(args.entities, 'Moeda').map(m => m.entity).join(', ')
    session.send('Aguarde um momento enquanto eu consulto a cotação das moedas.')
    
    request(`http://api-cotacoes-maratona-bots.azurewebsites.net/api/Cotacoes/${moedas}`, (error, response, body) => {

        if(error || !body) 
            return session.send('Não foi possível consultar a cotação')
        
        var cotacoes = JSON.parse(body)
        session.send(cotacoes.map(m => `${m.nome}: **${m.valor}**` ).join('\n\n'))
    })
})

intents.matches('None', (session, args) => {
    session.send('Me desculpe, mas não entendi o que quis dizer.')
})

intents.matches('Cumprimento', (session, args) => {
    session.send('Olá, em quê posso te ajudar?')
})



bot.dialog('/', intents);