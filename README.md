# TeamsConversationBot-Node.JS - Connection Watson
Bot Framework v4 Conversation Bot sample for Teams.


This bot has been created using [Bot Framework](https://dev.botframework.com). This sample shows
how to incorporate basic conversational flow into a Teams application. It also illustrates a few of the Teams specific calls you can make from your bot.

To this sample, I use the SQL to store the users information like teams ID and Tenant ID

This Bot Sample was based on Teams Conversation Bot Sample on Node JS of microsoft, you can find this at this link:

https://github.com/microsoft/BotBuilder-Samples/tree/master/samples/javascript_nodejs

## Prerequisites

- Microsoft Teams is installed and you have an account
- [NodeJS](https://nodejs.org/en/)
- [ngrok](https://ngrok.com/) or equivalent tunnelling solution
- [IBM Cloud Account](https://cloud.ibm.com/login) 
- [MySQL](mysql.com/downloads/)

## To try this sample

> Note these instructions are for running the sample on your local machine, the tunnelling solution is required because
the Teams service needs to call into the bot.

1) Clone the repository

    ```bash
    git clone https://github.com/fallwhat/TeamsConversationBot-NodeJS-IBMWatson-Template.git
    
  
    ```

    ```
1) In a terminal, navigate to `TeamsConversationBot-Node.JS`

1) Install modules

    ```bash
    npm install
    #you can use npm audit to see or fix extensions
    ```
    

1) Run ngrok - point to port 3978

    ```bash
    ngrok http -host-header=rewrite 3978
    ```

1) Create [Bot Framework registration resource](https://dev.botframework.com/bots/new) in Azure
    - Use the current `https` URL you were given by running ngrok. Append with the path `/api/messages` used by this sample
    - Ensure that you've [enabled the Teams Channel](https://docs.microsoft.com/en-us/azure/bot-service/channel-connect-teams?view=azure-bot-service-4.0)
    - __*If you don't have an Azure account*__ you can use this [Bot Framework registration](https://docs.microsoft.com/en-us/microsoftteams/platform/bots/how-to/create-a-bot-for-teams#register-your-web-service-with-the-bot-framework)
    
1) Create a ibm bot at IBM CLoud at (https://cloud.ibm.com/login?redirect=%2Fresources)
    - __*If you don't have an IBM Cloud account* creat a new one at (https://cloud.ibm.com/registration)

1) Update the `.env` configuration for the bot to use the Microsoft App Id and App Password from the Bot Framework registration. (Note the App Password is referred to as the "client secret" in the azure portal and you can always create a new client secret anytime.)
  #you can get this credentials on https://dev.botframework.com/ after you create your own app, for more information watch this video that helps me a lot: https://www.youtube.com/watch?v=0EFvoocRRLU&t=6s   

1) __*This step is specific to Teams.*__
    - **Edit** the `manifest.json` contained in the  `teamsAppManifest` folder to replace your Microsoft App Id (that was created when you registered your bot earlier) *everywhere* you see the place holder string `<<YOUR-MICROSOFT-APP-ID>>` (depending on the scenario the Microsoft App Id may occur multiple times in the `manifest.json`)
    - **Zip** up the contents of the `teamsAppManifest` folder to create a `manifest.zip`
    - **Upload** the `manifest.zip` to Teams (in the Apps view click "Upload a custom app")
    #you can get this credentials on https://dev.botframework.com/ after you create your own app, for more information watch this video that helps me a lot: https://www.youtube.com/watch?v=0EFvoocRRLU&t=6s  
    
 1) Put your DataBase credentials on sql.js file

    ```
    After you create you DB no Mysql
    Change de occurences without credentials with your own user, password and DB Name
    ```
 1) Put your Watson APIURL on ConnectionWatson.JS file

    ```
    After you create your bot
    Change de occurences without credentials with your own ApiURL
    
    You need to configure the URL with date and session, consult the watson docs to more information: https://cloud.ibm.com/apidocs/assistant/assistant-v2
    ```
1) Run your bot at the command line:

    ```bash
    npm start
    ```

## Interacting with the bot

You can interact with this bot by sending it a message, or selecting a command from the command list. The bot will respond to the following strings. 

After tou point to your Watson API, you can edit responds at ibm cloud


### Avoiding Permission-Related Errors

You may encounter permission-related errors when sending a proactive message. This can often be mitigated by using `MicrosoftAppCredentials.trustServiceUrl()`. See [the documentation](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-howto-proactive-message?view=azure-bot-service-4.0&tabs=javascript#avoiding-401-unauthorized-errors) for more information.

## Deploy the bot to Azure

To learn more about deploying a bot to Azure, see [Deploy your bot to Azure](https://aka.ms/azuredeployment) for a complete list of deployment instructions.

## Further reading

- [How Microsoft Teams bots work](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-basics-teams?view=azure-bot-service-4.0&tabs=javascript)
