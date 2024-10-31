const InvariantError = require('../../error/InvariantError');
const { PostUserPayloadSchema } = require('./schema');

const ValidatorUsersSchema = {
  validateUserPayload: (payload) => {
    const validationResult = PostUserPayloadSchema.validate(payload);

    const { value, error } = validationResult;

    if (error) {
      throw new InvariantError(error.message);
    }

    return value;
  },
};

module.exports = ValidatorUsersSchema;
