//setting e imports
const fs = require('fs'); // necesitado para guardar/cargar notificationService
const apiErrorMod = require('./apiExceptions'); // ApiExceptions
const notificationMod = require('./notificationService2.js'); // para cargar y usar el NS
const rp = require('request-promise');
const fetch = require('node-fetch');

// variables 
let express = require("express");
let app = express();
let router = express.Router();
let bodyParser = require('body-parser');
let port = process.env.PORT || 5001; //supongo que debe tener otro puerto

const UNQFY_BASEURL = 'http://172.20.0.21:5000/api';
//rp.get(UNQFY_BASEURL/artists).then( ... )


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

//Suscribe user to artist
router.route('/subscribe')
.post((req, res, next) => {
    let data = req.body;
    console.log(data)
    jsonExceptions(data)  
    fetchAndCallFunction(addSuscriptor,data,res,req,next);
});

//Unsuscribe email's user suscribed to artist
router.route('/unsubscribe')
.post((req, res, next) => {
    let data = req.body;
    jsonExceptions(data)
    fetchAndCallFunction(deleteSuscriptor,data,res,req,next);
});

//Notify
router.route('/notify')
.post((req, res, next) => {
    let data = req.body;
    console.log("Imprimiendo el data en el notify");
    console.log(data);
    if (data.artistId === undefined  || !esIdValido(data.artistId))  {
        throw new apiErrorMod.InvalidJsonParameterToAddArtistOrAlbum();
    }
    fetchAndCallFunction(notifyToSuscriptors,data,res,req,next);     
    });

//Get all suscriptors
router.route('/subscriptions')
.get((req, res, next) => {
        let data = req.query;
        console.log(data);
        if(!esIdValido(data.artistId)){
            throw new apiErrorMod.InvalidJsonParameterToAddArtistOrAlbum();
        }        
        fetchAndCallFunction(getEmailsOfSuscriptors,data,res,req,next);
});
    
//Delete all suscriptors
router.route('/subscriptions')
.delete((req, res, next) =>{
    let data = req.body;
    jsonExceptionsGet(data)
    fetchAndCallFunction(borrarTodasLasSuscripcionesDeUnArtista,data,res,req,next);
});
    
//Notification Service status
router.route('/status')
.head( (req, res,next) => {
    res.status(200);
    res.json();
});

//Invalid Route
app.use((req, res,next) => {
    let error = new apiErrorMod.InvalidOrInexistenceURL();
    res.status(error.status).json(error.toJSON()); 
    
});


//Functions
function saveNotificationService(ns, filename = 'suscriptors.json') {
    ns.save(filename);
}

//invocacion del Notification Service
function getNotificationService(filename = 'suscriptors.json') {
    let notificationService = new notificationMod.NotificationService();
    if (fs.existsSync(filename)) {
        notificationService = notificationMod.NotificationService.load(filename);
    }
    return notificationService;
}

//errorHandler
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

//data valid functions
function esIdValido(n){
    var a = !isNaN(+n) 
    var b = isFinite(n)
    return a&& b;
}

//data valid functions
function esMailValido(mail){
    return (!esIdValido(mail) && mail.includes("@"))
}

function jsonExceptions(data){
    if (data.artistId === undefined || data.email === undefined)  {
        throw new apiErrorMod.InvalidJsonParameterToAddArtistOrAlbum();
    }
    
    if (!esIdValido(data.artistId) || !esMailValido(data.email) ) {
        throw new apiErrorMod.InvalidJsonParameterToAddArtistOrAlbum();
    } 
}

function fetchAndCallFunction(func,data,res,req,next){
    fetch(UNQFY_BASEURL+ "/artists/"+data.artistId, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        mode: "cors"
    })
    .then(function(response) {
        if (!response.ok) {
            throw new apiErrorMod.AddingAlbumToAndInexistenceArtist();
        }
        return response
    })
    .then(data2 => func(data,res))
    .catch(error => errorHandler(error,req,res,next));
}

function addSuscriptor(data,res){
    console.log("Existen artistas con ese id, se va a crear la suscripcion");
    let ns = getNotificationService();
    ns.suscribe(data.artistId,data.email);
    console.log("acabo de suscribir");
    saveNotificationService(ns);
    console.log("acabo de guardar");
    res.status(200);
    res.json();
}

function deleteSuscriptor(data,res){
    console.log("Existen usuarios con ese id, se va a crearla suscripcion");
    let ns = getNotificationService();
    ns.unsuscribe(data.artistId,data.email);
    console.log("acabo de desuscribir");
    saveNotificationService(ns);
    console.log("acabo de guardar");
    res.status(200);
    res.json();
}

function notifyToSuscriptors(data,res){
    console.log("Enviando notificaciones");
    let ns = getNotificationService();
    ns.notify(data.artistId,data.subject,data.message);
    res.status(200);
    res.json();
}

function jsonExceptionsGet(data){
    if (data.artistId === undefined )  {
        throw new apiErrorMod.InvalidJsonParameterToAddArtistOrAlbum();
    }
    
    if (!esIdValido(data.artistId) ) {
        throw new apiErrorMod.InvalidJsonParameterToAddArtistOrAlbum();
    } 
}

function getEmailsOfSuscriptors(data,res){
    console.log("Enviando notificaciones");
    let ns = getNotificationService();
    let emails = ns.getSuscriptorsEMAILSForArtistId(data.artistId);
    res.status(200);
    res.json({artistId: data.artistId,emails});
}

function borrarTodasLasSuscripcionesDeUnArtista(data,res){
    console.log("Existen artistas con ese id, se van a borrar todas sus suscripciones");
    let ns = getNotificationService();
    ns.deleteSuscriptorsForArtistId(data.artistId);
    console.log("acabo de borrar todas las suscripciones");
    saveNotificationService(ns);
    console.log("acabo de guardar");
    res.status(200);
    res.json();
}