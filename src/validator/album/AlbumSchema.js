const Joi = require('joi');

const PayloadAlbumSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().required(),
}).unknown(false);

module.exports = { PayloadAlbumSchema };
