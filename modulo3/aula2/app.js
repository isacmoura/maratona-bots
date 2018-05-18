var builder = require('botbuilder');
var restify = require('restify');
var botCards = require('./cards');

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

//recebe a session do usuário e inicia processo de resposta
var bot = new builder.UniversalBot(connector, [
    function(session) {
        console.log(session.message.text);
        builder.Prompts.choice(session, 'Qual card você quer testar?', botCards.CardNames, {
            maxRetries: 5,
            retryPrompt: 'Opção inválida, tente novamente'
        });
    },

    function(session, results) {
        var selectedCardName = results.response.entity;
        var card = botCards.Card(selectedCardName, session);

        var msg = new builder.Message(session).addAttachment(card);
        session.send(msg);
    }
])

// Register in-memory state storage
bot.set('storage', new builder.MemoryBotStorage());
// Endpoint que irá monitorar as mensagens do usuário
server.post('/api/messages', connector.listen());

