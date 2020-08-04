const rp = require('request-promise');

const BASE_URL = 'http://api.musixmatch.com/ws/1.1';

function saveUNQfy(unqfy, filename = 'data.json') {
    unqfy.save(filename);
  }

class MusixMatchRequester {
    constructor(unqfy) {
        this.apikey = '5d830a9ff4dfc07b59930b35e04d3f5f';
        this.unqfy = unqfy;
    }
    
    getLyricsFor(track){
        
        var optionsId = {
        uri: BASE_URL + '/track.search',
        qs: {
        apikey: this.apikey,
        q_artist: this.unqfy.getArtistById(track.getArtistId()).getName(),
        q_track: track.getName(),
        },
        json: true // Automatically parses the JSON string in the response
        };

        rp.get(
            optionsId
            ).then((response) => {
                var header = response.message.header;
                var body = response.message.body;
                //console.log(header);
                //console.log(body);
                if (header.status_code !== 200){
                throw new Error('status code != 200 al intentar obtener ID');
                }
                var id = body.track_list[0].track.track_id;
                //console.log("El ID de la cancion es :"+ id);
                track.idMM = id;
                return id;
                
                
                })
            
            
            .then((id) => {
                var options = {
                    uri: BASE_URL + '/track.lyrics.get',
                    qs: {
                    apikey: this.apikey,
                    track_id: id,
                    },
                    json: true // Automatically parses the JSON string in the response
                    };
                rp.get(
                        options
                        ).then((response) => {
                        var header = response.message.header;
                        var body = response.message.body;
                        //console.log(header);
                        //console.log(body);
                        if (header.status_code !== 200){
                        throw new Error('status code != 200 al intentar obtener el lyric');
                        }
                        

                        var lyricsSong = body.lyrics.lyrics_body;

                        track.setLyrics(lyricsSong);
                        
                        return lyricsSong;
                        
                        }).then((lyricsSong)=>{
                            track.lyrics = lyricsSong;
                            saveUNQfy(this.unqfy);
                        

                        }).then(()=>{console.log(track.lyrics)})
                        .catch((error) => {
                        console.log('algo salio mal', error);
                        });
            
            
            
            })
        
    }
 
  }
  
  module.exports = {
    MusixMatchRequester,
  };


