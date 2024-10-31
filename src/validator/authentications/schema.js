const Joi = require('joi');

const PostPayloadAuthenticationSchema = Joi.object({
  username: Joi.string().empty('').required(),
  password: Joi.string().empty('').required(),
}).unknown(false);

const PutPayloadAuthenticationSchema = Joi.object({
  refreshToken: Joi.string().empty('').required(),
}).unknown(false);

const DeletePayloadAuthenticationSchema = Joi.object({
  refreshToken: Joi.string().empty('').required(),
}).unknown(false);

module.exports = {
  PostPayloadAuthenticationSchema,
  PutPayloadAuthenticationSchema,
  DeletePayloadAuthenticationSchema,
};
