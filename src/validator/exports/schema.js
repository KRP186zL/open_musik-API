const Joi = require('joi');

const ExportPayloadSchema = Joi.object({
  targetEmail: Joi.string().empty('').email({ tlds: true }).required(),
});

module.exports = { ExportPayloadSchema };
