var builder = require('botbuilder');
var restify = require('restify');
var cognitiveServices = require('botbuilder-cognitiveservices');

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

var bot = new builder.UniversalBot(connector, (session) =>{
    session.send(`You sent ${session.message.text} wich was ${session.message.text.length} characters`)
});

// Register in-memory state storage
bot.set('storage', new builder.MemoryBotStorage());
// Endpoint que irá monitorar as mensagens do usuário
server.post('/api/messages', connector.listen());

//Definindo um evento
bot.on('deleteUserData', (message) => {
    console.log(`deleteUserData ${JSON.stringify(message)}`)
});

bot.on('conversationUpdate', (message) =>{
    console.log(`conversationUpdate ${JSON.stringify(message)}`)
});

bot.on('typing', (message) =>{
    console.log(`typing ${JSON.stringify(message)}`)
});

bot.on('ping', (message) =>{
    console.log(`ping ${JSON.stringify(message)}`)
});

bot.on('contactRelationUpdate', (message) =>{
    console.log(`contactRelationUpdate ${JSON.stringify(message)}`)
});