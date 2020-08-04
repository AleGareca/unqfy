const picklify = require('picklify'); // para cargar/guarfar unqfy
const fs = require('fs'); // para cargar/guarfar unqfy
const albummod = require('./album.js'); // para cargar/guarfar unqfy
const artistmod = require('./artist.js'); // para cargar/guarfar unqfy
const trackmod = require('./track.js'); // para cargar/guarfar unqfy
const playlistmod = require('./playlist.js'); // para cargar/guarfar unqfy
const musixMatchRequesterMod = require('./musixMatchRequester.js'); // para cargar y usar el MMR
const spotifyRequesterMod = require('./spotifyRequester.js'); // para cargar y usar el SR
const observerMod = require('./observer.js'); // para cargar y usar el SR
const monitorObserverMod = require('./monitorObserver.js');


class UNQfy {

  constructor() {
    this.playlists = [];
    this.artistas = [];
    this.idTrack = 0;
    this.idAlbum = 0;
    this.idArtist = 0;
    this.idPlaylist = 0;
    this.musixMatchRequester = new musixMatchRequesterMod.MusixMatchRequester(this);
    this.spotifyRequester = new spotifyRequesterMod.SpotifyRequester(this);
    this.observer= new observerMod.Observer();
    this.monitorObserver = new monitorObserverMod.MonitorObserver();
  }
  ////////////////////////////////////////////////////////////
  /////////////// SETTERS DE ID/////////////////////////////
  /////////////////////////////////////////////////////////
  setNewTrackId() {
    this.idTrack++;
  }
  setNewArtistId() {
    this.idArtist++;
  }
  setNewAlbumId() {
    this.idAlbum++;
  }
  setNewPlaylistId() {
    this.idPlaylist++;
  }


  ////////////////////////////////////////////////////////////////////////
  ///////////////FUNCIONES DE ALTA DE OBJETOS/////////////////////////////
  ///////////////////////////////////////////////////////////////////////

  // artistData: objeto JS con los datos necesarios para crear un artista
  //   artistData.name (string)
  //   artistData.country (string)
  // retorna: el nuevo artista creado
  dato(n){
    return (n === undefined) ;
  }
 setObservers(observer){
  // seteando el observer a todos los artistas
  this.getAllArtists().forEach(artist => artist.suscribe(observer));
} 


  addArtist(artistData) {
    
    let newArtist = new artistmod.Artist(artistData.name, artistData.country, this.idArtist + 1);
    this.setNewArtistId();
    newArtist.subscribe(this.observer);
    //newArtist.subscribeMonitor(this.monitorObserver);
    newArtist.subscribe(this.monitorObserver);
    this.artistas.push(newArtist);
    //newArtist.notifyMonitor(newArtist.name,newArtist.id,newArtist.name,"Se agrego el artista");
    newArtist.notify(newArtist.name,newArtist.id,newArtist.name,"Se agrego el artista","addArtist");
    return newArtist;
    

    /* Crea un artista y lo agrega a unqfy.
    El objeto artista creado debe soportar (al menos):
      - una propiedad name (string)
      - una propiedad country (string)
    */

  }
  artistExists(artistName){
    return this.getArtistByName(artistName) !== undefined;
  }
  artistExistsById(artistId){

    try{

      this.getArtistById(artistId)
    
    }
    catch(err){
      return false;
    }
      return true;
    
  }

 
 

 albumExists(artistId,albumName){
   let artist= this.getArtistById(artistId);
  let albumToFind =  artist.getAlbums().find(a=>a.name == albumName);
      
    return (albumToFind !== undefined);
  }

  // albumData: objeto JS con los datos necesarios para crear un album
  //   albumData.name (string)
  //   albumData.year (number)
  // retorna: el nuevo album creado
  addAlbum(artistId, albumData) {
    /* Crea un album y lo agrega al artista con id artistId.
      El objeto album creado debe tener (al menos):
       - una propiedad name (string)
       - una propiedad year (number)
    */
    let artist = this.getArtistById(artistId);
    let newAlbum = new albummod.Album(artist.id, albumData.name, albumData.year, this.idAlbum + 1);
    this.setNewAlbumId();
    //newAlbum.subscribeMonitor(this.monitorObserver);
    newAlbum.subscribe(this.monitorObserver);
    artist.addAlbum(newAlbum)

    return newAlbum;
  }


  addAlbumPromise(artistId, albumData) {
    return function(){
      let artist = this.getArtistById(artistId);
      let newAlbum = new albummod.Album(artist.id, albumData.name, albumData.year, this.idAlbum + 1);
      this.setNewAlbumId();
      artist.albums.push(newAlbum);

    }

  }

  // trackData: objeto JS con los datos necesarios para crear un track
  //   trackData.name (string)
  //   trackData.duration (number)
  //   trackData.genres (lista de strings)
  // retorna: el nuevo track creado
  addTrack(albumId, trackData) {
    /* Crea un track y lo agrega al album con id albumId.
    El objeto track creado debe tener (al menos):
        - una propiedad name (string),
        - una propiedad duration (number),
        - una propiedad genres (lista de strings)
    */
    
    let album = this.getAlbumById(albumId);   
    let newTrack = new trackmod.Track(albumId, trackData.genres, trackData.name, trackData.duration, this.idTrack + 1, album.autorId,null);
    this.setNewTrackId();
    album.addTrack(newTrack);   
    return newTrack;
  }
  
  // name: nombre de la playlist
  // genresToInclude: array de generos
  // maxDuration: duración en segundos
  // retorna: la nueva playlist creada

  createPlaylist(name, genresToInclude, maxDuration) {
    /*** Crea una playlist y la agrega a unqfy. ***
      El objeto playlist creado debe soportar (al menos):
        * una propiedad name (string)
        * un metodo duration() que retorne la duración de la playlist.
        * un metodo hasTrack(aTrack) que retorna true si aTrack se encuentra en la playlist.
    */

    let newPlaylist = new playlistmod.Playlist(name, maxDuration, this.idPlaylist + 1, genresToInclude);
    this.setNewPlaylistId();
    newPlaylist.loadTracksToPlaylist(this.getTracksMatchingGenres(newPlaylist.genresToInclude));

    this.playlists.push(newPlaylist);
    return newPlaylist;
  }
  ////////////////////////////////////////////////////////////////////////
  ///////////////BUSQUEDAS///////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////
  getArtistById(id) {
    return this.getById(this.artistas, id, "Este artista no existe");
  }
  getArtistByIdSinError(id) {
    return this.getByIdSinError(this.artistas, id);
  }

  getAlbumById(id) {

    return this.getById(this.getAllAlbums(), id, "Este Album no existe");
  }
  getTrackById(id) {
    return this.getById(this.getAllTracks(), id, "Este Track no existe");
  }

  getPlaylistById(id) {
    return this.getById(this.playlists, id, "Esta Playlist no existe");
  }
  getByIdSinError(array, id) {
    let result = array.find((elem) => elem.id === id);

    
      return result;
    
  }
  getById(array, id, mensajeAlNoEncontrar) {
    let result = array.find((elem) => elem.id === id);

    if (result === undefined) {
      throw new Error(mensajeAlNoEncontrar);
    } else {
      return result;
    }
  }

  getArtistByName(artistName) {

    let artists = this.artistas.find((artista) => artista.name === artistName);
    return artists;
  }

  getAlbumByName(albumName) {

    let albums = this.getAllAlbums.find((album) => album.name === albumName);
    return albums;
  }
 

  getAllAlbums() {
    let albums = this.artistas.map((artista) => artista.albums);
    let resultado = [].concat.apply([], albums);
    return resultado;
  }

  getAllTracks() {
    let tracks = this.getAllAlbums().map((album) => album.tracks);
    let resultado = [].concat.apply([], tracks);
    return resultado;
  }

  getAllPlaylists() {
    return this.playlists;
  }
  // genres: array de generos(strings)
  // retorna: los tracks que contenga alguno de los generos en el parametro genres
  getTracksMatchingGenres(genresToCheck) {
    return this.getAllTracks().filter((track) => track.genres.some(element => genresToCheck.includes(element)));
  }

  // artistName: nombre de artista(string)
  // retorna: los tracks interpredatos por el artista con nombre artistName
  getTracksMatchingArtist(artistName) {
    let artist = this.getArtistByName(artistName);
    let tracksArtist = artist.albums.map((album) => album.tracks);
    let resultado = [].concat.apply([], tracksArtist);
    return resultado;
  }

  searchByName(name) {
    let artists = this.filterByName(this.artistas, name)
    let playlists = this.filterByName(this.playlists, name)
    let tracks = this.filterByName(this.getAllTracks(), name)
    let albums = this.filterByName(this.getAllAlbums(), name)

    return {
      artists,
      albums,
      tracks,
      playlists
    };
  }
  searchArtistByName(name) {
    
    if(name === undefined){
      return this.getAllArtists();
    }else{
      let artists = this.filterByName(this.artistas, name);
      return artists;
    }
    
  }
  searchAlbumByName(name) {
    
    if(name === undefined){
      return this.getAllAlbums();
    }else{
      let artists = this.filterByName(this.getAllAlbums(), name);
      return artists;
    }
    
  }

  filterByName(array, name) {
    return array.filter(element => element.name.toLowerCase().includes(name.toLowerCase()));
  }

  getAllAlbumsForArtist(nameArtist){


    return this.getArtistByName(nameArtist).getAlbums();
  }

  getMMr(){
    return this.musixMatchRequester;
  }

  getLyricsFor(trackId){
    let track = this.getTrackById(trackId);
    
    return track.getLyrics(this); 
  }

  setIdMMFor(trackId){
    let track = this.getTrackById(trackId);
    this.getMMr().getMMId(track);
  }

  ////////////////////////////////////////////////////////////////////////
  ///////////////FUNCIONES DE BAJA DE OBJETOS/////////////////////////////
  //////////////////////////////////////////////////////////////////////
  deleteTrack(trackId) {
    let trackToDelete = this.getTrackById(trackId);
    let albumOfThisTrack = this.getAlbumById(trackToDelete.albumId);
    albumOfThisTrack.deleteTrack(trackId);
    this.deleteTrackFromAllThePlaylists(trackToDelete);
  }

  deleteTrackFromAllThePlaylists(trackToDelete) {

    this.playlists.forEach(p => p.deleteTrack(trackToDelete));

  }

  getAllArtists() {
    return this.artistas;
  }

  deleteArtist(artistId) {
    let indexOFArtistToRemove = this.artistas.findIndex(artist => artist.id === artistId);
    if (indexOFArtistToRemove != -1) {
      this.artistas[indexOFArtistToRemove].notify(this.artistas[indexOFArtistToRemove].getName(),artistId,this.artistas[indexOFArtistToRemove].getName(),"Se borro el artista","deleteArtist");
      this.artistas[indexOFArtistToRemove].unsubscribe(this.observer);
      this.artistas.splice(indexOFArtistToRemove, 1);
      this.deleteAllTracksOfArtistInPlaylists(artistId);
    }
    return indexOFArtistToRemove != -1
  }

  deleteAllTracksOfArtistInPlaylists(artistId) {
    this.playlists.forEach(p => p.deleteTracksOfArtist(artistId));
  }

  deletePlaylist(playlistId) {
    let indexOFPlaylistToRemove = this.playlists.findIndex(playlist => playlist.id === playlistId);
    this.playlists.splice(indexOFPlaylistToRemove, 1);
  }

  deleteAlbum(albumId) {
    let albumToDelete = this.getAlbumById(albumId);
    let autor = this.getArtistById(albumToDelete.autorId);
    autor.deleteAlbum(albumId);
    this.deleteAllTracksFromAlbumInAllThePlaylists(albumId);
  }

  deleteAllTracksFromAlbumInAllThePlaylists(albumID) {
    this.playlists.forEach(p => p.deleteTracksFromAlbum(albumID));
  }

  populateAlbumsForArtist(artistName){

    let artistToPopulate = this.getArtistByName(artistName);
    return this.spotifyRequester.populateAlbumsForArtist(artistToPopulate);

  }

  createAlbum(artist,albumData){
    /* Dado un album de spotify, parseo e instancio un album de UNQFY*/ 
    this.addAlbum(artist.id,albumData)

  }
  addMultipleAlbumbs(artist,listOfAlbumsData) {
    /* Agrega cada uno de esos albumes al artista*/
    listOfAlbumsData.forEach(albumData => this.createAlbum(artist,albumData));

  }

  ////////////////////////////////////////////////////////////////////////
  ///////////////SAVE Y LOAD DE UNQFY////////////////////////////////////
  //////////////////////////////////////////////////////////////////////
  save(filename) {
    const listenersBkp = this.listeners;
    this.listeners = [];

    const serializedData = picklify.picklify(this);

    this.listeners = listenersBkp;
    fs.writeFileSync(filename, JSON.stringify(serializedData, null, 2));
  }

  static load(filename) {
    const serializedData = fs.readFileSync(filename, {
      encoding: 'utf-8'
    });
    //COMPLETAR POR EL ALUMNO: Agregar a la lista todas las clases que necesitan ser instanciadas
    const classes = [UNQfy, trackmod.Track, artistmod.Artist, albummod.Album, playlistmod.Playlist, musixMatchRequesterMod.MusixMatchRequester,spotifyRequesterMod.SpotifyRequester,observerMod.Observer,monitorObserverMod.MonitorObserver]
    return picklify.unpicklify(JSON.parse(serializedData), classes);
  }
}




// COMPLETAR POR EL ALUMNO: exportar todas las clases que necesiten ser utilizadas desde un modulo cliente
module.exports = {
  UNQfy,
};