//setting e imports
const apiErrorMod = require('./apiExceptions'); //apiExceptions
const rp = require('request-promise');
const fetch = require('node-fetch');

// variables 
let express = require("express");
let app = express();
let router = express.Router();
let bodyParser = require('body-parser');
let port = process.env.PORT || 5002;
let loggingEnable = true;

const UNQFY_BASEURL = 'http://172.20.0.21:5000/api';
const NOTIFICATION_BASEURL = 'http://172.20.0.22:5001/api';

// Indica en que Puerto estas actualmente
app.listen(port);
console.log('Actualmente estas usando el puerto ' + port);

router.use(function (req, res, next) {
    // do logging
    console.log('Request received!');
    next();
});

// Express Settings
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
console.log("La api esta corriendo correctamente");
app.use('/api', router);
app.use(errorHandler); // Registramos un manejador de errores


//ErrorHandler
function errorHandler(err, req, res, next) {
    console.error(err); // imprimimos el error en consola
    // Chequeamos que tipo de error es y actuamos en consecuencia
    if (err instanceof apiErrorMod.APIError) {
        res.status(err.status);
        res.json({
            status: err.status,
            errorCode: err.errorCode
        });
    } else if (err.type === 'entity.parse.failed') { 
        let invalidJsonParameterToAddArtistOrAlbum = new apiErrorMod.InvalidJsonParameterToAddArtistOrAlbum();
        res.status(invalidJsonParameterToAddArtistOrAlbum.status);
        res.json({
            status: invalidJsonParameterToAddArtistOrAlbum.status,
            errorCode: invalidJsonParameterToAddArtistOrAlbum.errorCode
        });
    } else {
        // continua con el manejador de errores por defecto
        next(err);
    }
};

//UnqfyStatus
router.route('/unqfystatus')
    .head((req, res, next) => {

        fetch(UNQFY_BASEURL+"/status", {
                method: "HEAD",
                headers: {
                    "Content-Type": "application/json"
                },
                mode: "cors"
        }).then(function(response) {
                if (response.ok) {
                    console.log("UNQFY IS RUNNING");
                    res.status(200);
                    res.json(); 
                    return response;
                } else {
                    throw new Error("Could not reach the API: " + response.statusText);
                }
        })
        .catch(function(error) {
                console.log("UNQFY IS NOT RUNNING");
                res.status(400);
                res.json();
        });
    });


//NOTIFICATION SERVICE STATUS
router.route('/notificationservicestatus')
.head((req, res, next) => {
    
    fetch(NOTIFICATION_BASEURL+"/status", {
            method: "HEAD",
            headers: {
                "Content-Type": "application/json"
            },
            mode: "cors"
    }).then(function(response) {
            if (response.ok) {
                console.log("NOTIFICATION SERVICE IS RUNNING");
                res.status(200);
                res.json(); 
                return response;
            } else {
                throw new Error("Could not reach the API: " + response.statusText);
            }
    })
    .catch(function(error) {
        console.log("NOTIFICATION SERVICE IS NOT RUNNING");
        res.status(400);
        res.json();
    });

});


//Logging ON/OFF
router.route('/logging')
  .post( (req, res,next) => {
        loggingEnable = !loggingEnable;
        res.status(200).json({  loggingEnable: loggingEnable });
        if(loggingEnable){
            console.log("Servicio de Monitoreo Loggeando");
        }else{
            console.log("El Servicio de Monitoreo no esta Loggeando")
        }
     }
    
  );

//Logging Status
  router.route('/logging')
  .get( (req, res,next) => {
        res.status(200).json({  loggingEnable: loggingEnable });
        if(loggingEnable){
            console.log("Servicio de Monitoreo Loggeando");
        }else{
            console.log("El Servicio de Monitoreo no esta Loggeando")
        }
     }
    
  );

//Send a Log Message to Slack
  router.route('/logMessage')
  .post( (req, res,next) => {

        let data = req.body;
        
        if(loggingEnable){
            Slack.sendMessage(data.logPhrase,data.objectName)
            .then(function(response) {
                if (response == 'ok') {
                    console.log("Message sent");
                    res.status(200);
                    res.json(); 
                    return response;
                } else {
                    throw new Error("Could not reach the API: " + response.statusText);
                }
            }
            )
            .catch(function(error) {
                console.log("Error en el envio del mensaje al slack");
                res.status(400);
                res.json();
            });
        }else{
            console.log("NOTIFICATION SERVICE IS NOT RUNNING, MESSAGE NOT SENT");
            res.status(400);
            res.json();
        }
     }
    
  );


class Slack {
    constructor(){}

    static sendMessage(logPhrase , name) {
        let slackBody = {
            text: logPhrase + ": " + name
        };

        let res = rp({
            url: 'https://hooks.slack.com/services/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',
            method: 'POST',
            body: slackBody,
            json: true
        });
        return res;
    }
}


