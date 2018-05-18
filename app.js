var builder = require('botbuilder');
var restify = require('restify');
var cognitiveServices = require('botbuilder-cognitiveservices')

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

// Conexão com o QnA Maker
var recognizer = new cognitiveServices.QnAMakerRecognizer({
    knowledgeBaseId: 'd0a7e32d-5c37-45b3-a4dc-366639e642d8',
    subscriptionKey: '43a161e6aaaa44fca7359ef9f4dc9a32',
    top: 3
    // 3 respostas mais relevantes
});

var recognizer = builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/5d3a0f7c-6b27-4477-9aec-975eab52a845?subscription-key=32646e830d494df680529b8cd5e13c77&verbose=true&timezoneOffset=-180&q=')
var intents = builder.IntentDialog({
    recognizers: [recognizer]
})

intents.onDefault((session, args) => {
    session.send('Desculpe, não entendi');
})

bot.dialog('/', basicQnAMakerDialog)