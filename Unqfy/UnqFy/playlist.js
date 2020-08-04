class Playlist {

  constructor(name, maxDuracion, idPlaylist, genresToInclude) {
    this.name = name;
    this.tracks = [];
    this.maxDuracion = maxDuracion;
    this.id = idPlaylist;
    this.genresToInclude = genresToInclude;
  }

  duration() {
    let res = 0;
    this.tracks.forEach(track => res + track.duration);
    return res;
  }

  loadTracksToPlaylist(tracksToAdd) {
    let res = 0;
    for (let index = 0; index < tracksToAdd.length; index++) {
      let track = tracksToAdd[index];

      if (res + track.duration <= this.maxDuracion) {
        this.tracks.push(track);
        res = res + track.duration;
      }
    }
  }


  hasTrack(aTrack) {
    return this.tracks.includes(aTrack);
  }

  deleteTrack(aTrack) {
    if (this.hasTrack(aTrack)) {
      let indexOFTrackToRemove = this.tracks.findIndex(track => track.id === aTrack.trackId);
      this.tracks.splice(indexOFTrackToRemove, 1);
    }
  }

  deleteTracksFromAlbum(albumID) {
    for (let index = 0; index < this.tracks.length; index++) {
      const track = this.tracks[index];
      if (track.albumId === albumID) {
        this.tracks.splice(index, 1);
      }
    }
  }

  deleteTracksOfArtist(artistId) {
    for (let index = 0; index < this.tracks.length; index++) {
      const track = this.tracks[index];
      if (track.artistId === artistId) {
        this.tracks.splice(index, 1);
      }
    }
  }
}

module.exports = {
  Playlist,
};