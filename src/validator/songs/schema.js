const Joi = require('joi');

const PostPayloadSongSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().required(),
  genre: Joi.string().required(),
  performer: Joi.string().required(),
  duration: Joi.number().empty(0).optional(),
  albumId: Joi.string().empty('').optional(),
}).unknown(false);

const GetQuerySongSchema = Joi.object({
  title: Joi.string().empty('').optional(),
  performer: Joi.string().empty('').optional(),
}).unknown(false);

module.exports = { PostPayloadSongSchema, GetQuerySongSchema };
