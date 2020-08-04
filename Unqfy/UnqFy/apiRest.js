const unqmod = require('./unqfy'); // importamos el modulo unqfy
const fs = require('fs'); // necesitado para guardar/cargar unqfy
const apiErrorMod = require('./apiExceptions'); // necesitado para guardar/cargar unqfy


let express = require("express");
let app = express();
let router = express.Router();
let bodyParser = require('body-parser');
let port = process.env.PORT || 5000;

function getUNQfy(filename = 'data.json') {
  let unqfy = new unqmod.UNQfy();
  if (fs.existsSync(filename)) {
    unqfy = unqmod.UNQfy.load(filename);
  }
  return unqfy;
}

function saveUNQfy(unqfy, filename = 'data.json') {
  unqfy.save(filename);
}

router.use(function(req, res, next) {
  // do logging
  console.log('Request received!');
  next();
  });

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  console.log("La api esta corriendo correctamente");  
  app.use('/api', router);
  app.use(errorHandler); // Registramos un manejador de errores

    //Obtener todos los tracks, 
  //(accessed at GET http://localhost:8080/api/tracks/<id>)
  router.route('/tracks')
  .get( (req, res,next) => {
      //let data = req.query.name;
      let unqfy = getUNQfy();
      tracks = unqfy.getAllTracks();
      res.status(200).json(tracks);   
  }
  );
 
//////////TRACK  ///////////////////////

  router.route('/tracks')
  .post( (req, res,next) => {

      let data = req.body;
      let unqfy = getUNQfy();
      let trackData = {
        name: data.name,
        duration: parseInt(data.duration),
        genres: data.genres
      }
           
      let track = unqfy.addTrack(parseInt(data.albumId),trackData);
      saveUNQfy(unqfy);
      res.status(201);
      res.status(201).json(track.toJSON());
      
  });
  ///////// DELETE TRACK  ///////////////////////

  router.route('/tracks/:id')
  .delete( (req, res,next) => {

    let data = req.params.id;
    let unqfy = getUNQfy();
    try{
    unqfy.deleteTrack(parseInt(data));
    saveUNQfy(unqfy);
    res.status(204).json();
    }catch (err){
      throw new apiErrorMod.DeleteOrGetToInexistenceArtistOrAlbum();
    }
 
  });
////////////////////////////////////////////////
//////////A R T I S T A S  ///////////////////////
/////////////////////////////////////////////////
  // create an artist (accessed at POST //
  //http://localhost:8080/api/artists)
  router.route('/artists')
  .post( (req, res,next) => {

      let data = req.body;
      let unqfy = getUNQfy();
  
     if(unqfy.dato(data.name) || unqfy.dato(data.country)){
      throw new apiErrorMod.InvalidJsonParameterToAddArtistOrAlbum();
    }

    if(unqfy.artistExists(data.name)){
       throw new apiErrorMod.DuplicatedArtistOrAlbum();
      }
     
      let artist = unqfy.addArtist(data);
      saveUNQfy(unqfy);
      res.status(201)
      res.status(201).json(artist.toJSON());
 
  });
/////////////////////////////////////////////////////////////////////
  //Obtener un artista por su id, 
  //(accessed at GET http://localhost:8080/api/artists/<id>)
  router.route('/artists/:id')
  .get( (req, res,next) => {
      let data = req.params.id;
      let unqfy = getUNQfy();
      
      try{
        let artist = unqfy.getArtistById(parseInt(data));
        res.status(200).json(artist.toJSON());

      }catch (err){
        throw new apiErrorMod.DeleteOrGetToInexistenceArtistOrAlbum();
      }
     
      
  });
/////////////////////////////////////////////////////////////////
  //Borrar un artista por su id, 
  //(accessed at DELETE http://localhost:8080/api/artists/<id>)
  router.route('/artists/:id')
  .delete( (req, res,next) => {
      let data = req.params.id;
      let unqfy = getUNQfy();
      try{
      unqfy.getArtistById(parseInt(data));
      unqfy.deleteArtist(parseInt(data));
      saveUNQfy(unqfy);
      res.status(204).json();
      }catch (err){
        throw new apiErrorMod.DeleteOrGetToInexistenceArtistOrAlbum();
      }
      
      
  });
  //////////////////////////////////////////////////////////////////
    //Obtener todos los artistas, 
  //(accessed at GET http://localhost:8080/api/artists/<id>)
  router.route('/artists')
  .get( (req, res,next) => {
      let data = req.query.name;
      let unqfy = getUNQfy();
      artists = unqfy.searchArtistByName(data);
      res.status(200).json(artists);   
  }
  );

//////////////////////////////////////////////////
router.get('/', function (req, res) {
  res.json({
    message: 'hourraa i am working!'
  });
});

app.listen(port);
console.log('Actualmente estas usando el puerto ' + port);



///////////error handler///////////////////////////////////
function errorHandler(err, req, res, next) {
  console.error(err); // imprimimos el error en consola
  // Chequeamos que tipo de error es y actuamos en consecuencia
  if (err instanceof apiErrorMod.APIError){
  res.status(err.status);
  res.json({status: err.status, errorCode: err.errorCode});
  } else if (err.type === 'entity.parse.failed'){
  // body-parser error para JSON invalido
  //res = new InvalidJsonParameterToAddArtistOrAlbum();  
  let invalidJsonParameterToAddArtistOrAlbum =  new apiErrorMod.InvalidJsonParameterToAddArtistOrAlbum();
  res.status(invalidJsonParameterToAddArtistOrAlbum.status);
  res.json({status: invalidJsonParameterToAddArtistOrAlbum.status, errorCode: invalidJsonParameterToAddArtistOrAlbum.errorCode});
  } else {
  // continua con el manejador de errores por defecto
  next(err);
  }
  };

///////////////////////////////////////////// 
//////////A L B U M S ///////////////////////
/////////////////////////////////////////////
// delete an album (accessed at POST //
router.route('/albums/:id')
.delete( (req, res) => {
    let data = req.params.id;
    let unqfy = getUNQfy();
    try{
    unqfy.deleteAlbum(parseInt(data));
    saveUNQfy(unqfy);
    res.status(204).json();
    }
catch(err){
  throw new apiErrorMod.DeleteOrGetToInexistenceArtistOrAlbum();
}

});


 
 //Obtener un album por su id, 
  //(accessed at GET http://localhost:8080/api/artists/<id>)
  router.route('/albums/:id')
  .get( (req, res,next) => {
      let data = req.params.id;
      let unqfy = getUNQfy();
      try {
      let artist = unqfy.getAlbumById(parseInt(data));
      res.status(200).json(artist.toJSON());
      }catch (err){
        throw new apiErrorMod.DeleteOrGetToInexistenceArtistOrAlbum();
      }
  });

  //Obtener todos los albums, 
  //(accessed at GET http://localhost:8080/api/albums/<id>)
  router.route('/albums')
  .get( (req, res,next) => {
      let data = req.query.name;
      let unqfy = getUNQfy();
     try{ artists = unqfy.searchAlbumByName(data);
      res.status(200).json(artists); 
    }
     catch(err){
      throw new apiErrorMod.DeleteOrGetToInexistenceArtistOrAlbum()
     }
  }
  )


  // create an album (accessed at POST //
  //http://localhost:8080/api/artists)
  router.route('/albums')
  .post( (req, res,next) => {
      let data = req.body;
      let unqfy = getUNQfy();
      let albumData = {
        name: data.name,
        year: parseInt(data.year)
      }

      if( data.artistId === undefined ||unqfy.dato(albumData.name) || unqfy.dato(albumData.year)){
        throw new apiErrorMod.InvalidJsonParameterToAddArtistOrAlbum();
      }
      
      if(!unqfy.artistExistsById(parseInt(data.artistId))){
        console.log(!unqfy.artistExistsById(parseInt(data.artistId)))
        throw new apiErrorMod.AddingAlbumToAndInexistenceArtist();
      }

      if(unqfy.albumExists(parseInt(data.artistId),albumData.name)){
        throw new apiErrorMod.DuplicatedArtistOrAlbum();
      }
        let album=unqfy.addAlbum(parseInt(data.artistId),albumData);      
        saveUNQfy(unqfy);     
        res.status(201).json(album.toJSON());
   
     }
    
  );

  router.route('/status')
  .head( (req, res,next) => {
        res.status(200);
        res.json();
     }
    
  );

// INVALID ROUTE //
  
  app.use((req, res,next) => {
    let error = new apiErrorMod.InvalidOrInexistenceURL();
    res.status(error.status).json(error.toJSON()); 
    
  });
