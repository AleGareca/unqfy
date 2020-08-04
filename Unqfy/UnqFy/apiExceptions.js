
// Error personalizado
class APIError extends Error {
    constructor(name, statusCode, errorCode, message = null) {
      super(message || name);
      this.name = name;
      this.status = statusCode;
      this.errorCode = errorCode;
    }
  }
  class InvalidInputError extends APIError {
    constructor() {
      super('InvalidInputError', 400, 'INVALID_INPUT_DATA');
    }
  }
  class DuplicatedArtistOrAlbum extends APIError {
    constructor() {
      super('DuplicatedArtistOrAlbum', 409, 'RESOURCE_ALREADY_EXISTS');
    }
  }
  class AddingAlbumToAndInexistenceArtist extends APIError {
    constructor() {
      super('AddingAlbumToAndInexistenceArtist', 404, 'RELATED_RESOURCE_NOT_FOUND');
    }
  }
  class InvalidOrInexistenceURL extends APIError {
    constructor() {
      super('InvalidOrInexistenceURL', 404, 'RESOURCE_NOT_FOUND');}

      toJSON() {
     return{
        'status': 404,
        'errorCode': "RESOURCE_NOT_FOUND"
        
     }
      }
    
  }
  class DeleteOrGetToInexistenceArtistOrAlbum extends APIError {
    constructor() {
      super('DeleteOrGetToInexistenceArtistOrAlbum', 404, 'RESOURCE_NOT_FOUND');
    }
  }
  class InvalidJsonParameterToAddArtistOrAlbum extends APIError {
    constructor() {
      super('InvalidJsonParameterToAddArtistOrAlbum', 400, 'BAD_REQUEST');
    }
  }

  class UnexpectedFail extends APIError {
    constructor() {
      super('UnexpectedFail', 500, 'INTERNAL_SERVER_ERROR');
    }
  }
  class InexistenceTrack extends APIError {
    constructor() {
      super('InexistenceTrack', 404, 'RESOURCE_NOT_FOUND');
    }
  }

  module.exports = {
    InexistenceTrack, UnexpectedFail, InvalidJsonParameterToAddArtistOrAlbum,
    DeleteOrGetToInexistenceArtistOrAlbum,InvalidOrInexistenceURL,AddingAlbumToAndInexistenceArtist,
    InvalidInputError, DuplicatedArtistOrAlbum, APIError,
  };
