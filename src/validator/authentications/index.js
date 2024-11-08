const {
  PostPayloadAuthenticationSchema,
  PutPayloadAuthenticationSchema,
  DeletePayloadAuthenticationSchema,
} = require('./schema');

const InvariantError = require('../../error/InvariantError');

const ValidatorAuthenticationsSchema = {
  validatePostPayloadAuthentication: (payload) => {
    const validationResult = PostPayloadAuthenticationSchema.validate(payload);

    const { error, value } = validationResult;

    if (error) {
      throw new InvariantError(error.message);
    }

    return value;
  },
  validatePutPayloadAuthentication: (payload) => {
    const validationResult = PutPayloadAuthenticationSchema.validate(payload);

    const { error, value } = validationResult;

    if (error) {
      throw new InvariantError(error.message);
    }

    return value;
  },
  validateDeletePayloadAuth: (payload) => {
    const validationResult = DeletePayloadAuthenticationSchema.validate(payload);

    const { error, value } = validationResult;

    if (error) {
      throw new InvariantError(error.message);
    }

    return value;
  },
};

module.exports = ValidatorAuthenticationsSchema;
