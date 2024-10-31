const Joi = require('joi');

const PayloadSongSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().required(),
  genre: Joi.string().required(),
  performer: Joi.string().required(),
  duration: Joi.number().empty(0).optional(),
  albumId: Joi.string().empty('').optional(),
}).unknown(false);

const QuerySongSchema = Joi.object({
  title: Joi.string().empty('').optional(),
  performer: Joi.string().empty('').optional(),
}).unknown(false);

module.exports = { PayloadSongSchema, QuerySongSchema };
