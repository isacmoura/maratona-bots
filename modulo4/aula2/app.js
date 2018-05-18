var builder = require('botbuilder');
var restify = require('restify');

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

bot.on('conversationUpdate', (update) => {
    if(update.membersAdded){
        update.membersAdded.forEach(identity => {
            if(identity.id === update.address.bot.id){
                bot.loadSession(update.address, (err, session) => {
                    if(err)
                        return
                    session.send('Seja bem vindo, o que quer que eu faça?')
                })
            }
        })
    }
})

//LUIS
var recognizer = builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/5d3a0f7c-6b27-4477-9aec-975eab52a845?subscription-key=32646e830d494df680529b8cd5e13c77&verbose=true&timezoneOffset=-180&q=')
var intents = builder.IntentDialog({
    //Recognizers recebe um array com recognizers do LUIS
    recognizers: [recognizer]
})

bot.dialog('/', intents)