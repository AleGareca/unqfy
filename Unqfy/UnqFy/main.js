const fs = require('fs'); // necesitado para guardar/cargar unqfy
const unqmod = require('./unqfy'); // importamos el modulo unqfy


// Retorna una instancia de UNQfy. Si existe filename, recupera la instancia desde el archivo.
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


function main() {
  console.log('arguments: ');
  //process.argv.forEach(argument => console.log(argument));
  //console.log(process.argv.drop(2));
  let unqfy = getUNQfy();
  executeCommand(unqfy);
  //.then(()=>saveUNQfy(unqfy));
  // esto deberia devolver una promesa
  //saveUNQfy(unqfy);

  function executeCommandTest(unqfy){
    unqfy.addArtist({
      name: "Foo Fighters",
      country: "USA",
    });
    unqfy.addAlbum(1, {
      name: "Sonic Highways",
      year: 2014
    });
    unqfy.addTrack(1,{
      name: "The River",
      duration: 3.31,
      genres: ["rock","alternative rock"]
    });
  }

  function executeCommand(unqfy) {
  /*  let exito= "Promesa exitosa"
    let fallo= "Promesa fallida"
    let promesa = new Promise(exito,fallo);*/
    
      
  ///////////////////////////////////////  
    let args = process.argv.slice(2);
    let commandName = args[0];

    switch (commandName) {
      ///////////////////////////////////////
      /////////////// GETTERS ////////////////
      ///////////////////////////////////////
      case 'getAllArtists':
        console.log(unqfy.getAllArtists());
               
        break;

      case 'getAllAlbums':
        console.log(unqfy.getAllAlbums());
        
        break;

      case 'getAllTracks':
        console.log(unqfy.getAllTracks());
               
        break;

      case 'getAllPlaylists':
        console.log(unqfy.getAllPlaylists());
        
        break;


        ////////////////////////////////////////////////////////////
        /////////////// FUNCIONES DE ALTA DE OBJETOS////////////////
        ///////////////////////////////////////////////////////////
      case 'addArtist':
        let artistName = args[1];
        let artistCountry = args[2];
        unqfy.addArtist({
          name: artistName,
          country: artistCountry,
        })

        console.log("El artista: " + artistName + " se agrego correctamente");
        
        break;
        

      case 'addTrack':
        let albumId = parseInt(args[1]);
        let trackName = args[2];
        let trackDuration = parseInt(args[3]);
        let trackGenres = parseArray(args[4]);
        unqfy.addTrack(albumId, {
          name: trackName,
          duration: trackDuration,
          genres: trackGenres
        })

        console.log("El Track: " + trackName + " se agrego correctamente");
        break;

      case 'addAlbum':
        let artistIdAddAlbum = parseInt(args[1]);
        let albumName = args[2];
        let albumYear = parseInt(args[3]);
        unqfy.addAlbum(artistIdAddAlbum, {
          name: albumName,
          year: albumYear
        })

        console.log("El Album: " + albumName + " se agrego correctamente");
        break;

      case 'addPlaylist':
        let playlistName = args[1];
        let playlistGenres = parseArray(args[2]);
        let playlistDuration = parseInt(args[3]);

        unqfy.createPlaylist(playlistName, playlistGenres, playlistDuration);

        console.log("La playlist: " + playlistName + " se agrego correctamente");
        break;


        ////////////////////////////////////////////////////////////
        /////////////// FUNCIONES DE BAJA DE OBJETOS////////////////
        ///////////////////////////////////////////////////////////
      case 'deleteArtist':
        let artistId = parseInt(args[1]);

        let response = unqfy.deleteArtist(artistId);
        if (response) {
          console.log("El artista con " + artistId + " se eliminó correctamente");

        } else {
          console.log("Este id de Artista no existe");

        }
        console.log(unqfy.getAllArtists())
        break;

      case 'deleteTrack':
        let trackId = parseInt(args[1]);

        unqfy.deleteTrack(trackId);

        console.log("El track con " + trackId + " se eliminó correctamente");
        console.log(unqfy.getAllTracks())
        break;

      case 'deleteAlbum':
        let albumIdToDelete = parseInt(args[1]);

        unqfy.deleteAlbum(albumIdToDelete);

        console.log("El album con " + albumIdToDelete + " se eliminó correctamente");
        console.log(unqfy.getAllAlbums())
        break;

      case 'deletePlaylist':
        let playlistId = parseInt(args[1]);

        unqfy.deletePlaylist(playlistId);

        console.log("La playlist con " + playlistId + " se eliminó correctamente");
        console.log(unqfy.getAllPlaylists())
        break;

        ////////////////////////////////////////////////////////////
        /////////////// BUSQUEDAS////////////////////////////////////
        ///////////////////////////////////////////////////////////
      case 'searchByName':
        let name = args[1];
        console.log(unqfy.searchByName(name));

        break;

      case 'tracksOfArtist':
        let artistNameToGetTracks = args[1];
        console.log(unqfy.getTracksMatchingArtist(artistNameToGetTracks));

        break;

      case 'searchByGenre':
        let nameGenre = args[1];

        console.log(unqfy.getTracksMatchingGenres([nameGenre]));

        break;

      case 'getArtistsById':
        let idFromArtist = parseInt(args[1]);

        console.log(unqfy.getArtistById(idFromArtist));

        break;
      case 'getTrackById':
        let idFromTrack = parseInt(args[1]);

        console.log(unqfy.getTrackById(idFromTrack));

        break;

      case 'getAlbumById':
        let idFromAlbum = parseInt(args[1]);

        console.log(unqfy.getAlbumById(idFromAlbum));

        break;
      case 'getPlaylistById':
        let idFromPlaylist = parseInt(args[1]);

        console.log(unqfy.getPlaylistById(idFromPlaylist));

        break;

        case 'getLyricsFor':
        let idFromTrackForLyrics = parseInt(args[1]);
        
        unqfy.getLyricsFor(idFromTrackForLyrics);
        break;

        case 'populateAlbumsFor':
        // esto devuelve promesa
        let artistNameToPopulateAlbums = args[1];
        
        unqfy.populateAlbumsForArtist(artistNameToPopulateAlbums).then((response) => saveUNQfy(response)).catch((error) => {
          console.log('No se trajo ningun album', error);
      });;
        console.log("Agregaste los albums de " + artistNameToPopulateAlbums);

        break;
        

        case 'getAllAlbumsForArtist':
        // esto devuelve promesa
        let artistNameToShowAllAlbums = args[1];
        let promesaARetornar =unqfy.getAllAlbumsForArtist(artistNameToShowAllAlbums)
        console.log(promesaARetornar);
        break;
        
        
       // return Promise.resolve();
        //break;

       
    }

    if(commandName !== 'populateAlbumsFor'){
      saveUNQfy(unqfy);
    }
    //return Promise.resolve();
  }
  ///////////////////////////////////////////////////////////
  ////////////// FUNCIONES AUXILIARES ///////////////////////
  ///////////////////////////////////////////////////////////
  function parseArray(string) {
    return string.slice(0, -1).substr(1).split(",");
  }
}

main();