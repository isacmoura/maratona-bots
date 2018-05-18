var builder = require('botbuilder');
var restify = require('restify');
var formflow = require('formflowbotbuilder')
var path = require('path')

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
               bot.beginDialog(update.address, '/')
           }
       })
   }
})

var dialogo = 'form'
var questions = path.join(__dirname, 'questoes.json')
formflow.executeFormFlow(
    questions,
    bot,
    dialogo,
    (err, responses) => {
        if(err){
            return console.log(err)
        }
        bot.dialog(
            '/',
            [
                (session) => {
                    if(!session.userData.reload)
                        session.send('Olá, será um prazer te atender!')
                    session.beginDialog(dialogo)
                },

                //Pede para o usuário confirmar o pedido
                (session, results) => {
                    var pergunta = `Está tudo correto com o pedido?\n`
                    + `* Nome: ${responses.nome}\n` 
                    + `* Telefone: ${responses.telefone}\n`
                    + `* Endereço: ${responses.endereco}\n`
                    + `* Salgado: ${responses.salgado}\n`
                    + `* Bebida: ${responses.bebida}\n`
                    + `* Entrega: ${responses.entrega}`
                    
                    var opcoes = {
                        listStyle: builder.ListStyle.button,
                        retryPrompt: 'Desculpe, não entendi. Selecione uma das opções!'
                    }
                    builder.Prompts.confirm(session, pergunta, opcoes)
                        
                },
                (session, results) => {
                    if(results.response){
                        return session.send('Seu pedido foi gerado!')
                    }
                    session.userData.reload = true
                    session.send('Vamos tentar novamente')
                    session.replaceDialog('/')
                }
            ]
        )
    }
)