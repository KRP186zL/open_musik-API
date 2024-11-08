const InvariantError = require('../../error/InvariantError');
const { ExportPayloadSchema } = require('./schema');

const ExportsValidator = {
  validateExportPayload: (payload) => {
    const validationResult = ExportPayloadSchema.validate(payload);

    const { value, error } = validationResult;

    if (error) {
      throw new InvariantError(error.message);
    }

    return value;
  },
};

module.exports = ExportsValidator;
