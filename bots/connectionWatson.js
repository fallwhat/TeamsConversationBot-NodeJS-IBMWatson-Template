var axios = require('axios');
//Buscando Session
async function createSession(){
    var dataSession = JSON.stringify({"text":"hi"});

    var configSession = {
    method: 'post',
    url: '<<Your Watson API URL>>',
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

//Starting conversation
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
    url: `your Watson api url`,
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
