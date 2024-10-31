const InvariantError = require('../../error/InvariantError');
const { PostPayloadSongSchema, GetQuerySongSchema } = require('./schema');

const ValidatorSongsSchema = {
  validateSongPayload: (payload) => {
    const validationResult = PostPayloadSongSchema.validate(payload);

    const { value, error } = validationResult;

    if (error) {
      throw new InvariantError(error.message);
    }
    return value;
  },

  validateSongQuery: (query) => {
    const validationResult = GetQuerySongSchema.validate(query);

    const { value, error } = validationResult;

    if (error) {
      throw new InvariantError(error.message);
    }
    return value;
  },
};

module.exports = ValidatorSongsSchema;
