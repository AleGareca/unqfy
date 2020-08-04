const observableMod = require('./observable.js'); 

class Album extends observableMod.Observable {
  constructor(autor, name, year, idAlbum) {
    super();
    this.autorId = autor;
    this.name = name;
    this.year = year;
    this.id = idAlbum
    this.tracks = []

  }
  
  deleteTrack(trackId) {
    let indexOFTrackToRemove = this.tracks.findIndex(track => track.id === trackId);
    this.notify(this.name,this.id,this.tracks[indexOFTrackToRemove].name,"Se borro el track","deleteTrack");
    this.tracks.splice(indexOFTrackToRemove, 1);
  }

  addTrack(track){
    this.tracks.push(track);
    this.notify(this.name,this.id,track.name,"Se agrego el track","addTrack" );
    
  }

/*   notifyMonitor(name,id,albumName,loggingPhrase) {
    this.monitorObservers.forEach(function (observer) {
        observer.update(name,id,albumName,loggingPhrase);
        //console.log("Se agrego un album de " + name);
    });
  } */
  notify(name,id,albumName,loggingPhrase,changed) {
    this.observers.forEach(function (observer) {
        observer.update(name,id,albumName,loggingPhrase,changed);
        //console.log("Se agrego un album de " + name);
    });
  }

  toJSON(){
    return {
     
      'name': this.name,
      'year': this.year,
      'id': this.id,
      'tracks': this.tracks,
    }
}
}


module.exports = {
  Album,
};