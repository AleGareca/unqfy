const fetch = require('node-fetch');
const MONITOR_BASEURL = 'http://172.20.0.23:5002/api';

 class MonitorObserver {
    
    constructor() {
    }
    
    update(artistName,artistId,name,loggingPhrase,changed){
        console.log(loggingPhrase,name);
        this.sendLogging(loggingPhrase,name);
    }

    sendLogging(action,name) {
        
        let data = {
            logPhrase: action,
            objectName: name
        };

        fetch(MONITOR_BASEURL+"/logMessage/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data),
                mode: "cors"
        }).then(function(response) {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Could not reach the API: " + response.statusText);
                }
        }).then(function(data2) {
               console.log("Enviando mensaje de monitoreo");
               
        }).catch(function(error) {
                console.log("No se envio el mensaje de monitoreo");
        });

    }
    

 }

module.exports = {
    MonitorObserver,
    };