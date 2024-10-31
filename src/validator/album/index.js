const InvariantError = require('../../error/InvariantError');
const { PayloadAlbumSchema } = require('./AlbumSchema');

const AlbumValidator = {
  validateAlbumPayload: (payload) => {
    const validationResult = PayloadAlbumSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
    return validationResult.value;
  },
};

module.exports = AlbumValidator;
