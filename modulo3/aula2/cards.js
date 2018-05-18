var builder = require('botbuilder');

var heroCard = 'Hero card'
var thumbnailCard = 'Thumbnail card'
var animationCard = 'Animation card'
var audioCard = 'Audio card'
var videoCard = 'Video card'
var receiptCard = 'Receipt card'
var signinCard = 'Signin card'
var CardNames = [heroCard, thumbnailCard, animationCard, audioCard, videoCard, receiptCard, signinCard];

function Card(selectedCardName, session) {
    switch (selectedCardName.trim()) {
        case heroCard:
            return HeroCard(session);
        case thumbnailCard:
            return ThumbnailCard(session);
        case animationCard:
            return AnimationCard(session);
        case audioCard:
            return AudioCard(session);
        case videoCard:
            return VideoCard(session);
        case receiptCard:
            return ReceiptCard(session);
        case signinCard:
            return SigninCard(session);
    }
}

function HeroCard (session){
    return new builder.HeroCard(session)
                .title('Oferta do dia')
                .subtitle('Confira nossa oferta do dia da pizzaria Cedro')
                .text('Pizza de calabresa com borda de coxinha. Tá 500 conto')
                .images([
                    builder.CardImage.create(session, 'http://www.ocladapizza.com.br/wp-content/uploads/2017/02/massa-da-pizza-conhe%C3%A7a-6-ingredientes-e-suas-fun%C3%A7%C3%B5es-blog-pizzaria-o-cla-da-pizza-660x420.jpg')
                ])
                .buttons([
                    builder.CardAction.openUrl(session, 'https://facebook.com/izakimoura', 'Compre agora!'),
                    builder.CardAction.postBack(session, 'diga-ok', 'Ok?')
                ])
}

function ThumbnailCard(session) {
    return new builder.ThumbnailCard(session)
                .title('Oferta do dia')
                .subtitle('Confira nossa oferta do dia da pizzaria Cedro')
                .text('Pizza de calabresa com borda de coxinha. Tá 500 conto')
                .images([
                    builder.CardImage.create(session, 'http://www.ocladapizza.com.br/wp-content/uploads/2017/02/massa-da-pizza-conhe%C3%A7a-6-ingredientes-e-suas-fun%C3%A7%C3%B5es-blog-pizzaria-o-cla-da-pizza-660x420.jpg')
                ])
                .buttons([
                    builder.CardAction.openUrl(session, 'https://facebook.com/izakimoura', 'Compre agora!'),
                    builder.CardAction.postBack(session, 'diga-ok', 'Ok?')
                ])
}

function ReceiptCard(session) {
    var order = (new Date()).getTime()
    return new builder.ReceiptCard(session)
                .title('Demonstração do Receipt Card')
                .facts([
                    builder.Fact.create(session, order, 'Pedido N°: '),
                    builder.Fact.create(session, 'MASTER 5396 **** **** **99', 'Pagamento')
                ])
                .items([
                    builder.ReceiptItem.create(session, 'R$ 10,00', 'Pizza comum')
                        .quantity(500)
                        .image(builder.CardImage.create(session, 'http://www.ocladapizza.com.br/wp-content/uploads/2017/02/massa-da-pizza-conhe%C3%A7a-6-ingredientes-e-suas-fun%C3%A7%C3%B5es-blog-pizzaria-o-cla-da-pizza-660x420.jpg')),
                    builder.ReceiptItem.create(session, 'R$ 20,00', 'Pizza M + Refrigerante 1,5L')
                        .quantity(250)
                        .image(builder.CardImage.create(session, 'https://www.cidadeoferta.com.br/media/offers/3010-tomattus29_imagem1.jpg'))
                ])
                .tax('R$ 2,00')
                .total('R$ 10.002,00')
                .buttons([
                    builder.CardAction.openUrl(session, 'http://www.dominos.com.br/', 'Finalizar compra')
                    //.image('https://raw.githubusercontent.com/amido/azure-vector-icons/master/renders/microsoft-azure.png')
                ]);
}

function SigninCard(session) {
    return new builder.SigninCard(session)
                .text('Autenticar com Facebook')
                .button('Autenticar', 'https://facebook.com')
}

function AnimationCard(session) {
    return new builder.AnimationCard(session)
                .title('GIF do dia')
                .subtitle('Separei um GIF para alegrar seu dia')
                .text('Os gatos vão dominar o mundo!')
                .media([
                    {url: 'https://media1.giphy.com/media/nNxT5qXR02FOM/giphy.gif'}
                ])
}

function VideoCard(session) {
    return new builder.VideoCard(session)
                .title('Vídeo do dia')
                .subtitle('Aqui está o vídeo que separei para você')
                .text('Tenha um ótimo dia!')
                .media([
                    {url: 'https://youtu.be/ZoX7vNyCFmA'}
                ])
                .autostart(true)
                .autoloop(true)
                .buttons([
                    builder.CardAction.openUrl(session, 'https://youtu.be/ZoX7vNyCFmA', 'Ver no YouTube')
                ])
}

function AudioCard(session) {
    return new builder.AudioCard(session)
                .title('Áudio do dia')
                .subtitle('Aqui está o áudio que separei para você')
                .text('Tenha um ótimo dia!')
                .media([
                    {url: 'http://sampleswap.org/samples-ghost/%20MAY%202014%20LATEST%20ADDITIONS/PUBLIC%20DOMAIN%20SPOKEN%20WORD/2574[kb]wikipedia-buffalo-buffalo-buffalo-buffalo.mp3.mp3'}
                ])
                .autostart(true)
                .autoloop(true)
                .buttons([
                    builder.CardAction.openUrl(session, 'https://youtu.be/ZoX7vNyCFmA', 'Ver no YouTube')
                ])
}

module.exports = {
    CardNames: [heroCard, thumbnailCard, animationCard, audioCard, videoCard, receiptCard, signinCard],
    Card: Card
}

