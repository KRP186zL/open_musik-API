const InvariantError = require('../../error/InvariantError');
const { PostPayloadAlbumSchema } = require('./schema');

const ValidatorAlbumsSchema = {
  validateAlbumPayload: (payload) => {
    const validationResult = PostPayloadAlbumSchema.validate(payload);

    const { value, error } = validationResult;

    if (error) {
      throw new InvariantError(error.message);
    }
    return value;
  },
};

module.exports = ValidatorAlbumsSchema;
