const InvariantError = require('../../error/InvariantError');
const { PayloadSongSchema, QuerySongSchema } = require('./SongSchema');

const SongValidator = {
  validateSongPayload: (payload) => {
    const validationResult = PayloadSongSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
    return validationResult.value;
  },

  validateSongQuery: (query) => {
    const validationResult = QuerySongSchema.validate(query);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
    return validationResult.value;
  },
};

module.exports = SongValidator;
