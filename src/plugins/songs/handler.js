const autoBind = require('auto-bind');

class SongHandler {
  #service;

  #validator;

  constructor(service, validator) {
    this.#service = service;
    this.#validator = validator;

    autoBind(this);
  }

  async postSongHandler(request, h) {
    const validatedPayload = this.#validator.validateSongPayload(request.payload);

    const {
      title, year, genre, performer, duration, albumId,
    } = validatedPayload;

    const data = await this.#service.postSong(title, year, genre, performer, duration, albumId);

    const response = h.response({
      status: 'success',
      data,
    });
    response.code(201);

    return response;
  }

  async getSongHandler(request, h) {
    const validatedQuery = this.#validator.validateSongQuery(request.query);

    const { title, performer } = validatedQuery;

    const songs = await this.#service.getSong(title, performer);

    const response = h.response({
      status: 'success',
      data: {
        songs,
      },
    });
    response.code(200);

    return response;
  }

  async getSongByIdHandler(request, h) {
    const { id } = request.params;

    const song = await this.#service.getSongById(id);

    const response = h.response({
      status: 'success',
      data: {
        song,
      },
    });
    response.code(200);

    return response;
  }

  async putSongByIdHandler(request, h) {
    const { id } = request.params;

    const validatedPayload = this.#validator.validateSongPayload(request.payload);

    const {
      title, year, genre, performer, duration, albumId,
    } = validatedPayload;

    await this.#service.putSongById(id, title, year, genre, performer, duration, albumId);

    const response = h.response({
      status: 'success',
      message: 'Song berhasil diperbarui.',
    });
    response.code(200);

    return response;
  }

  async deleteSongByIdHandler(request, h) {
    const { id } = request.params;

    await this.#service.deleteSongById(id);

    const response = h.response({
      status: 'success',
      message: 'Song berhasil dihapus.',
    });
    response.code(200);

    return response;
  }
}

module.exports = SongHandler;
