const InvariantError = require('../../error/InvariantError');
const {
  PostPlaylistPayloadSchema,
  PostPlaylistSongPayloadSchema,
  DeletePlaylistSongPayloadSchema,
} = require('./schema');

const ValidatorPlaylistsSchema = {
  validatePostPlaylistPayload: (payload) => {
    const validationResult = PostPlaylistPayloadSchema.validate(payload);

    const { value, error } = validationResult;

    if (error) {
      throw new InvariantError(error.message);
    }

    return value;
  },
  validatePostPlaylistSongPayload: (payload) => {
    const validationResult = PostPlaylistSongPayloadSchema.validate(payload);

    const { value, error } = validationResult;

    if (error) {
      throw new InvariantError(error.message);
    }

    return value;
  },
  validateDeletePlaylistSongPayload: (payload) => {
    const validationResult = DeletePlaylistSongPayloadSchema.validate(payload);

    const { value, error } = validationResult;

    if (error) {
      throw new InvariantError(error.message);
    }

    return value;
  },
};

module.exports = ValidatorPlaylistsSchema;
