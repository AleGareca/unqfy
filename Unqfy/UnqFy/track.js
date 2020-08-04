
class Track  {
  constructor(albumId, genres, name, duration, idTrack, artistId,lyricsP) {

    this.albumId = albumId;
    this.artistId = artistId;
    this.genres = genres;
    this.name = name;
    this.duration = duration;
    this.id = idTrack;
    this.lyrics = lyricsP;

  }
 
  toJSON(){
    return {
      'trackId': this.id,
      'albumId': this.albumId,
      'genres': this.genres,
      'name': this.name,
      'duration': this.duration,
    }
    }

  getLyrics(unqfy){
    if(this.lyrics === null || this.lyrics === undefined ){
      
      
      return unqfy.getMMr().getLyricsFor(this);
      
    }
    else{
      console.log(this.lyrics);
      return this.lyrics;
    }
  }

  getId(){
    return this.id;
  }
  getArtistId(){
    return this.artistId;
  }

  getName(){
    return this.name;
  }
  
  setLyrics(lyricsP){
    this.lyrics = lyricsP;
  }
  
}

module.exports = {
  Track,
};