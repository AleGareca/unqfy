# UNQfy

Dos aclaraciónes sobre el enunciado:
   - los tracks siempre deben pertenecer un album, NO pueden haber track "sueltos"
   - los álbumes solo pueden tener un author(artista). El artista puede tener varios álbumes
   - Todos los comandos empiezan con: node main.js comando parametros
   - Por ejemplo: node main.js addArtist "Carlos" "Peru"

////////////////////////////////////////////////////////////
///////////////           Getters           ////////////////
///////////////////////////////////////////////////////////
getAllArtists
getAllAlbums
getAllTracks
getAllPlaylists
        
////////////////////////////////////////////////////////////
/////////////// FUNCIONES DE ALTA DE OBJETOS////////////////
///////////////////////////////////////////////////////////
addArtist artistName artistCountry
addTrack albumId trackName trackDuration trackGenres
addAlbum artistIdAddAlbum albumName albumYear
addPlaylist playlistName playlistGenres playlistDuration
createPlaylist playlistName playlistGenres playlistDuration

////////////////////////////////////////////////////////////
/////////////// FUNCIONES DE BAJA DE OBJETOS////////////////
///////////////////////////////////////////////////////////
deleteArtist artistId
deleteTrack trackId
deleteAlbum albumIdToDelete
deletePlaylist playlistId

////////////////////////////////////////////////////////////
/////////////// BUSQUEDAS////////////////////////////////////
///////////////////////////////////////////////////////////
searchByName name
tracksOfArtist artistNameToGetTracks
searchByGenre nameGenre
getArtistsById idFromArtist
getTrackById idFromTrack
getAlbumById idFromAlbum
getPlaylistById idFromPlaylist