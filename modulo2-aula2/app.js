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
    knowledgeBaseId: 'b0f2e601-ebaf-4ee9-9a9e-9e5617d468d3',
    subscriptionKey: '43a161e6aaaa44fca7359ef9f4dc9a32',
    top: 3
    // 3 respostas mais relevantes
});

// Biblioteca para oferecer ao usuário todas as opções determinadas
var qnaMakerTools = new cognitiveServices.QnAMakerTools();
bot.library(qnaMakerTools.createLibrary());

// Diálogo de interação com o usuário
var basicQnAMakerDialog = new cognitiveServices.QnAMakerDialog({
    recognizers: [recognizer],
    defaultMessage: 'Não encontrado! Tente mudando os termos da pergunta!',
    qnaThreshold: 0.5,
    // Nível de confiança na resposta
    feedbackLib: qnaMakerTools
});

bot.dialog('/', basicQnAMakerDialog)