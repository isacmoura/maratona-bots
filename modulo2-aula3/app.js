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

// Endpoint que irá monitorar as mensagens do usuário
server.post('/api/messages', connector.listen());

// Recebe as mensagens do usuário e responde repetindo cada mensagem (prefixado com 'Você disse:')
var bot = new builder.UniversalBot(connector, function (session) {
    session.send("Você disse: %s", session.message.text);
});

var connector = new builder.ConsoleConnector().listen();
var bot = new builder.UniversalBot(connector, function (session) {
    session.send("Você disse: %s", session.message.text);
});

// Conexão com o QnA Maker
var recognizer = new cognitiveServices.QnAMakerRecognizer({
<<<<<<< HEAD
    knowledgeBaseId: 'b0f2e601-ebaf-4ee9-9a9e-9e5617d468d3',
    subscriptionKey: '43a161e6aaaa44fca7359ef9f4dc9a32',
    top: 3
    // 3 respostas mais relevantes
=======
    knowledgeBaseId: '',
    subscriptionKey: '' 
>>>>>>> 43ba9a6de717e639b712563c7523488c98c47785
});

// Biblioteca para oferecer ao usuário todas as opções determinadas
var qnaMakerTools = new cognitiveServices.QnAMakerTools();
bot.library(qnaMakerTools.createLibrary());

// Diálogo de interação com o usuário
var basicQnAMakerDialog = new cognitiveServices.QnAMakerDialog({
    recognizers: [recognizer],
    defaultMessage: 'Não encontrado! Tente mudando os termos da pergunta!',
<<<<<<< HEAD
    qnaThreshold: 0.5,
    // Nível de confiança na resposta
    feedbackLib: qnaMakerTools
=======
    qnaThreshold: 0.3
>>>>>>> 43ba9a6de717e639b712563c7523488c98c47785
});

basicQnAMakerDialog.respondFromQnAMakerResult = function(session, qnaMakerResult){
    // Salva a pergunta do usuário
    var question = session.message.text;
    session.conversationData.userQuestion = question;

    // Checar se o resultado está formatado para ser um card
    var isCardFormat = qnaMakerResult.answers[0].answer.includes(';');

    if(!isCardFormat){
        // Se não houver um ponto e vírgula na frase, então envia uma resposta normal
        session.send(qnaMakerResult.answers[0].answer);
    }else if(qnaMakerResult.answers && qnaMakerResult.score >= 0.5){
        var qnaAnswer = qnaMakerResult.answers[0].answer;
        // Quebra a resposta em um vetor
        var qnaAnswerData = qnaAnswer.split(';');
        var title = qnaAnswerData[0];
        var description = qnaAnswerData[1];
        var url = qnaAnswerData[2];
        var imageURL = qnaAnswerData[3];

        var msg = new builder.Message(session)
        msg.attachments([
            new builder.HeroCard(session)
            .title(title)
            .subtitle(description)
            .ihimages([builder.CardImage.create(session, imageURL)])
            .buttons([
                builder.CardAction.openUrl(session, url, "Saiba Mais")
            ])
        ]);
    }
    session.send(msg).endDialog();
}

//bot.dialog('/', basicQnAMakerDialog)
