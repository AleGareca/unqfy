const fetch = require('node-fetch');

const NOTIFICATION_BASEURL = 'http://172.20.0.22:5001/api';

 class Observer {
    
    constructor() {
    }
    
    update(artistName,artistId,albumName,loggingPhrase,changed){
        if(changed == "addAlbum"){
            console.log(artistName,artistId,albumName);
            this.sendNotification(artistName,artistId,albumName);
        }
    }

    sendNotification(artistName,artistId,albumName) {
        
        let data = {
            artistId: artistId,
            subject: 'Nuevo Album para ' + artistName,
            message: 'Se ha agregado el album: ' + albumName,
            from: 'UNQfy <unqfyg4@gmail.com>'
        };

        fetch(NOTIFICATION_BASEURL+'/notify/', {
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
               console.log("Enviando notificaciones");
               
        }).catch(function(error) {
                console.log("No existen artistas con ese ID");

        });

    }
    
    unsuscribeAllMails(artistId){


        let data = {
            artistId: artistId
        };

        fetch(NOTIFICATION_BASEURL + "/subscriptions/", {
                method: "DELETE",
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
               console.log("Se borraron todos los mails suscriptos al artista con el id: " +artistId);
               
        }).catch(function(error) {
                console.log("No existen artistas con ese ID");
        });
    }
            
    };
    


module.exports = {
    Observer,
    };