const autoBind = require('auto-bind');

class AlbumHandler {
  #service;

  #validator;

  constructor(service, validator) {
    this.#service = service;
    this.#validator = validator;
    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    const validatedAlbumPayload = this.#validator.validateAlbumPayload(request.payload);

    const { name, year } = validatedAlbumPayload;

    const data = await this.#service.postAlbum(name, year);

    const response = h.response({
      status: 'success',
      data,
    });
    response.code(201);

    return response;
  }

  async getAlbumByIdHandler(request, h) {
    const { id } = request.params;

    const album = await this.#service.getAlbumById(id);

    const response = h.response({
      status: 'success',
      data: {
        album,
      },
    });
    response.code(200);

    return response;
  }

  async putAlbumByIdHandler(request, h) {
    const { id } = request.params;

    const validatedAlbumPayload = this.#validator.validateAlbumPayload(request.payload);

    const { name, year } = validatedAlbumPayload;
    await this.#service.putAlbumById(id, name, year);

    const response = h.response({
      status: 'success',
      message: 'Album berhasil diperbarui.',
    });
    response.code(200);

    return response;
  }

  async deleteAlbumByIdHandler(request, h) {
    const { id } = request.params;

    await this.#service.deleteAlbumById(id);

    const response = h.response({
      status: 'success',
      message: 'Album berhasil dihapus.',
    });
    response.code(200);

    return response;
  }
}

module.exports = AlbumHandler;