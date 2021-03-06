require('dotenv-extended').load();
var builder      = require('botbuilder');
var restify      = require('restify');
var connector    = new builder.ChatConnector({appId: process.env.MICROSOFT_APP_ID, appPassword: process.env.MICROSOFT_APP_PASSWORD});
var bot          = new builder.UniversalBot(connector);

bot.dialog('/', [
    function(session) {
        session.beginDialog('/ensureProfile', session.userData.profile);
    },
    function(session, results) {
        session.userData.profile = results.response;
        session.send('Hello %(name)s! I love %(company)s!', session.userData.profile);
    }
]);

bot.dialog('/ensureProfile', [
    function(session,args,next) {
        session.dialogData.profile = args || {};
        console.log("profile = " + JSON.stringify(session.dialogData.profile));
        if(!session.dialogData.profile.name) {
            builder.Prompts.text(session,"Hi, what's your name?");
        } else {
            next();
        }
    },
    function(session, results, next) {
        if(results.response) {
            session.dialogData.profile.name = results.response;
        }
        if(!session.dialogData.profile.company) {
            builder.Prompts.text(session,"What company do you work for?");
        } else {
            next();
        }
    },
    function(session, results) {
        if(results.response) {
            session.dialogData.profile.company = results.response;
        }
        session.endDialogWithResult({response: session.dialogData.profile});
    }
]);

/* LISTEN IN THE CHAT CONNECTOR */
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
server.post('/api/messages', connector.listen());