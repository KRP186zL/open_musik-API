const Joi = require('joi');

const PostUserPayloadSchema = Joi.object({
  username: Joi.string().empty('').required(),
  password: Joi.string().empty('').required(),
  fullname: Joi.string().empty('').required(),
}).unknown(false);

module.exports = { PostUserPayloadSchema };
