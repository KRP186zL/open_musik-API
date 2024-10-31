const Joi = require('joi');

const PostPayloadAlbumSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().required(),
}).unknown(false);

module.exports = { PostPayloadAlbumSchema };
