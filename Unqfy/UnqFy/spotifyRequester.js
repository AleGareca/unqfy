const rp = require('request-promise');

const BASE_URL = 'https://api.spotify.com/v1';

function saveUNQfy(unqfy, filename = 'data.json') {
    unqfy.save(filename);
}

class SpotifyRequester {
    constructor(unqfy) {
        this.access_token = "BQBitSV7MQJe_KhMvzlWGRwdDnoUDAJnfYb_dyTBQwOIb73dQ-ygpwyQBtUeL7nRb9Ydyy8GU0PZNlgNH_M-emAfVQA_zTeMSVXRPHuG06rKpSfddUd51JfFfF0Gl5-AiMliyNTQL7vz4LQKb2_XQXoTXnr_5tNQ8w";
        this.refresh_token = "AQDC75GTqmyNv98LHgeDymdDiXWnkjbpmoEJwpbbMK_0vZ9rCem4BBeRnNAvy5w71G_qXK_EKDjBvd1rR91EBb9gaybU4HLin0tDWlGqTw85aMzIoUk8_2pKozgVaT0cbVFwrw";
      
        this.unqfy = unqfy;
    }

    populateAlbumsForArtist(artist) {

        if(artist === undefined){
            throw new Error("No existe ningun artista con ese nombre en UNQFY");
        }

        return this.getArtistIdByName(artist.getName()).then((id) => this.getAlbumsOfArtistByID(id))
            .then((listOfAlbums) => {

                listOfAlbums.forEach((a) => this.unqfy.addAlbum(artist.id, {
                    name: a.name,
                    year: a.release_date.substring(0, 4)
                }));
                return this.unqfy;
            })
    }

    getAlbumsOfArtistByID(id) {

        var options = {
            url: BASE_URL + '/artists/' + id + '/albums',
            headers: {
                Authorization: 'Bearer ' + this.access_token
            },
            json: true,
        };
        return rp.get(options).then((response) => {

            return response.items;

        }).catch((error) => {
            console.log('La cagaste trayendo los albums', error);
        });
    }


    getArtistIdByName(artistName) {

        const optionsID = {
            url: BASE_URL + '/search?q=' + artistName + '&type=artist',
            headers: {
                Authorization: 'Bearer ' + this.access_token
            },
            json: true,
        };
        return rp.get(optionsID).then((response) => {
            return response.artists.items[0].id;
        }).catch((error) => {
            console.log('La cagaste en el id', error);
        });
    }


}

module.exports = {
    SpotifyRequester,
};