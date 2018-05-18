var builder = require('botbuilder');
var entities = require('html-entities');
var htmlentities = new entities.AllHtmlEntities();

var BrazilianQnaMakerTools = (function(){

    var answerSelectionDialog = [
        function (session, args) {
            var qnaMakerResult = args;
            session.dialogData.qnaMakerResult = qnaMakerResult;
            var questionOptions = qnaMakerResult.answers.map(function(qna){
                return htmlentities.decode(qna.questions[0]);
            });
            var promptOptions = {
                 listStyle: builder.listStyle.button
            };
            builder.promptOptions.choice(session, 'Escolha abaixo', questionOptions, promptOptions);
        },

        function (session, results) {
            var qnaMakerResult = session.dialogData.qnaMakerResult;
            var filteredResult = qnaMakerResult.answers.filter(function(qna){
                return htmlentities.decode(qna.questions[0]) === results.response.entity;
            });
            var selectedQna = filteredResult[0];
            session.send(selectedQna.answer);
            session.endDialogWithResult(selectedQna);
        }
    ];

    function BrazilianQnaMakerTools(options){
        this.lib = new builder.Library('brazilianQnaMakerTools');
        this.lib.dialog('answerSelection', )
    }

    BrazilianQnaMakerTools.prototype.createLibrary = function(){
        return this.lib;
    };

    BrazilianQnaMakerTools.prototype.answerSelector = function(session, options){
        session.beginDialog('brazilianQnaMakerTools:answerSelection', options || {})
    };

    return BrazilianQnaMakerTools;
}());
exports.BrazilianQnaMakerTools = BrazilianQnaMakerTools;