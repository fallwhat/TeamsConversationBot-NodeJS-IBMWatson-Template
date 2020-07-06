// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const {
    TurnContext,
    MessageFactory,
    TeamsInfo,
    TeamsActivityHandler,
    CardFactory,
    ActionTypes
} = require('botbuilder');

class TeamsConversationBot extends TeamsActivityHandler {


    constructor() {
        super();
        this.onMessage(async (context, next) => {
            TurnContext.removeRecipientMention(context.activity);
            const text = context.activity.text.trim().toLocaleLowerCase()
            //To delete the card who is already selected
            try {
                await this.deleteCardActivityAsync(context);
            }
            catch (e) {
                console.log(e)
            }
            // Here we're checking if the user is already recorded in DB
            try {
                const SelectUser = require('./sql').selectSingleUser
                let member = await TeamsInfo.getMember(context, context.activity.from.id);
                await SelectUser(this.poolConnection, member.email)
            }
            catch (e) {
                await this.UserRegister(context);
            }
            //Call watson API and send activity to user
            await this.WatsonResponseAsync(context, text);

        });
        //Connection to SQL DB
        const mysql = require('mysql');

        this.poolConnection = mysql.createPool({
            connectionLimit: 100,
            host: '<<your host name>>',
            user: '<<user name of your DB>>',
            password: '<<DB password>>',
            database: '<<DB name>>'
        })

    }

    async WatsonResponseAsync(context, text) {
        const SelectSession = require('./sql').SelectSession
        const UpdateSession = require('./sql').UpdateSession
        const watson = require('./connectionWatson')
        async function criando() {
            const dados = await watson.createSession()
                .then(resp => {
                    return resp
                })
                .catch(err => {
                    console.log('creat session error: ', err)
                })
            let sessionData = JSON.parse(dados)
            return sessionData.session_id
        }
        async function conversando(text, sessionData) {
            let response = watson.sendMessage(`"${text}"`, sessionData)
                .then(function (response) {
                    return response.data
                })
                .catch(function (error) {
                    console.log(`send message error: ${error}`);
                });
            return response

        }
        try {
            let member = await TeamsInfo.getMember(context, context.activity.from.id);
            let session_id = await SelectSession(this.poolConnection, member)
                .then(resp => {
                    return resp
                })
                .catch(err => {
                    console.log(err)
                })
            var response = await conversando(text, session_id[0].session_id)
                .then(resp => {
                    return resp
                })
            //Forcing error when the member doesn't exists    
            console.log(response.output.generic[0].title)
        } catch (e) {
            console.log(`Member doesn't exists: ${e}`)
            let member = await TeamsInfo.getMember(context, context.activity.from.id);
            let session_id = await criando()
                .then(resp => {
                    return resp
                })
                .catch(err => {
                    console.log(err)
                })
            let updatenow = await UpdateSession(this.poolConnection, member, session_id)
                .then(resp => {
                    return resp
                })
                .catch(err => {
                    console.log(err)
                })
            let session_data = await SelectSession(this.poolConnection, member)
                .then(resp => {
                    return resp
                })
                .catch(err => {
                    
                })
            var response = await conversando(text, session_data[0].session_id)
                .then(resp => {
                    return resp
                })
                .catch(err => {
                    console.log(err)
                })

        }
        if (response.output.generic[0].options != null) {
            var cardActions = []
            cardActions = await this.cardConstructorActivityAsync(response.output.generic[0])
                .then(resp => {
                    return resp
                })
                .catch(err => {
                    console.log(err)
                })
            const card = CardFactory.heroCard(
                '',
                '',
                null,
                cardActions
            );
            await context.sendActivity(response.output.generic[0].title);
            await context.sendActivity(MessageFactory.attachment(card));
            return
        } else if (response.context.skills["main skill"].user_defined.link && response.output.intents[0].intent != 'despedida') {
            await context.sendActivity(response.output.generic[0].text);
            await context.sendActivity(response.context.skills["main skill"].user_defined.link);
            let member = await TeamsInfo.getMember(context, context.activity.from.id);
            let session_id = await SelectSession(this.poolConnection, member)
                .then(resp => {
                    return resp
                })
                .catch(err => {
                    console.log(err)
                })
            var response = await conversando('Quero saber mais', session_id[0].session_id)
                .then(resp => {
                    return resp
                })
            var cardActions = []
            cardActions = await this.cardConstructorActivityAsync(response.output.generic[0])
                .then(resp => {
                    return resp
                })
                .catch(err => {
                    console.log(err)
                })
            const card = CardFactory.heroCard(
                '',
                '',
                null,
                cardActions
            );
            await context.sendActivity(response.output.generic[0].title);
            await context.sendActivity(MessageFactory.attachment(card));
            return
        } else if (response.output.intents[0].intent != 'despedida') {
            await context.sendActivity(response.output.generic[0].text);
            let member = await TeamsInfo.getMember(context, context.activity.from.id);
            let session_id = await SelectSession(this.poolConnection, member)
                .then(resp => {
                    return resp
                })
                .catch(err => {
                    console.log(err)
                })
            var response = await conversando('Quero saber mais', session_id[0].session_id)
                .then(resp => {
                    return resp
                })
            var cardActions = []
            cardActions = await this.cardConstructorActivityAsync(response.output.generic[0])
                .then(resp => {
                    return resp
                })
                .catch(err => {
                    console.log(err)
                })
            const card = CardFactory.heroCard(
                '',
                '',
                null,
                cardActions
            );
            await context.sendActivity(response.output.generic[0].title);
            await context.sendActivity(MessageFactory.attachment(card));
            return
        }
        else { await context.sendActivity(response.output.generic[0].text); }




    }
    async cardConstructorActivityAsync(response) {
        var cardActions = []
        var card
        for (var n in response.options) {
            card = {
                type: ActionTypes.MessageBack,
                title: response.options[n].label,
                value: null,
                text: response.options[n].value.input.text
            }
            cardActions.push(card)
        }
        return cardActions
    }
    async sendCard(context, cardActions, response) {
        const initialValue = {
            count: 0
        };
        const card = CardFactory.heroCard(
            response.title,
            '',
            null,
            cardActions
        );
        await context.sendActivity(MessageFactory.attachment(card));
    }


    async UserRegister(context) {
        var member
        const insert = require('./sql').NewUser

        member = await TeamsInfo.getMember(context, context.activity.from.id);
        await insert(this.poolConnection, member)
            .then(resp => {
                return resp
            })
            .catch(e => {
                console.log(e);
                return
            })

    }

    async deleteCardActivityAsync(context) {
        await context.deleteActivity(context.activity.replyToId);
    }

}

module.exports.TeamsConversationBot = TeamsConversationBot;
