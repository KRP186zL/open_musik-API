const Joi = require('joi');

const PostPlaylistPayloadSchema = Joi.object({
  name: Joi.string().empty('').required(),
}).unknown(false);

const PostPlaylistSongPayloadSchema = Joi.object({
  songId: Joi.string().empty('').required(),
}).unknown(false);
const DeletePlaylistSongPayloadSchema = Joi.object({
  songId: Joi.string().empty('').required(),
}).unknown(false);

module.exports = {
  PostPlaylistPayloadSchema,
  PostPlaylistSongPayloadSchema,
  DeletePlaylistSongPayloadSchema,
};
