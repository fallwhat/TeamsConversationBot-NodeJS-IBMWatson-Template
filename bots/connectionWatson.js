var axios = require('axios');
//Buscando Session
async function createSession(){
    var dataSession = JSON.stringify({"text":"oi"});

    var configSession = {
    method: 'post',
    url: 'https://gateway.watsonplatform.net/assistant/api/v2/assistants/a5f05884-c47c-4d44-8078-029e1371cc3f/sessions?version=2020-04-01',
    headers: { 
        'Authorization': 'Basic YXBpa2V5OmtqVWlNTzBhY040ZUpvWldab2JudFVpVUZZMVZ0NkJlXzc4SE1SWVdpQmlo', 
        'Content-Type': 'application/json'
    },
    dataSession : dataSession
    };

    const retornoSession = await axios(configSession)
    .then(function (response) {
        const resposta = JSON.stringify(response.data);
        return resposta
    })
    .catch(function (error) {
        console.log(error);
    });

    return retornoSession
}

//Iniciando Conversa
async function sendMessage(message,session){ 
    console.log(message)   
    var data = JSON.stringify({
        "input": {
            "text": message,
            'options':{
                'return_context': true,
              }
        }
    });

    var config = {
    method: 'post',
    url: `https://gateway.watsonplatform.net/assistant/api/v2/assistants/a5f05884-c47c-4d44-8078-029e1371cc3f/sessions/${session}/message?version=2020-04-01`,
    headers: { 
        'Authorization': 'Basic YXBpa2V5OmtqVWlNTzBhY040ZUpvWldab2JudFVpVUZZMVZ0NkJlXzc4SE1SWVdpQmlo', 
        'Content-Type': 'application/json'
    },
    data : data
    };

    return axios(config)    
}

module.exports = {
    sendMessage,
    createSession
}