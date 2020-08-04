const observableMod = require('./observable.js'); 

class Artist extends observableMod.Observable{
  constructor(name, country, idArtist) {
    super();
    this.name = name; 
    this.country = country;
    this.id = idArtist
    this.albums = [];
    //this.subscribe(new Observer())
  }
  deleteAlbum(albumId) {
    let indexOfAlbumToRemove = this.albums.findIndex(album => album.id === albumId);
    this.notify(this.name,this.id,this.albums[indexOfAlbumToRemove].name,"Se borro el album","deleteAlbum");
    this.albums.splice(indexOfAlbumToRemove, 1);
  }

  getAlbums(){
    return this.albums;
  }
  getName(){
    return this.name;
  }

  addAlbum(album){
    //console.log("ADD ALBUM")
    //console.log(album);
    this.albums.push(album);
    // notifico a mis observer sobre el nuevo cambio
    this.notify(this.name,this.id,album.name,"Se agrego el album","addAlbum");
    //this.notifyMonitor(this.name,this.id,album.name,"Se agrego el album");
  }

  toJSON(){
    return {
      'id': this.id,
      'name': this.name,
      'albums': this.albums,
      'country': this.country,
    }
  }

    subscribe(f) {
    this.observers.push(f);
    console.log("se ha suscrito al artista " + this.name);
}

  unsubscribe(f) {
  super.unsubscribe(f);
  f.unsuscribeAllMails(this.id);
  }
notify(name,id,albumName,loggingPhrase,changed) {
  this.observers.forEach(function (observer) {
      observer.update(name,id,albumName,loggingPhrase,changed);
      //console.log("Se agrego un album de " + name);
  });
}

/* notifyMonitor(name,id,albumName,loggingPhrase) {
  this.monitorObservers.forEach(function (observer) {
      observer.update(name,id,albumName,loggingPhrase);
      //console.log("Se agrego un album de " + name);
  });
} */

}



module.exports = {
  Artist,
};