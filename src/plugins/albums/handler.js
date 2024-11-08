const autoBind = require('auto-bind');

class AlbumHandler {
  #storageService;

  #albumsService;

  #likeService;

  #validatorAlbums;

  #validatorUploads;

  constructor(storageService, albumsService, likeService, validatorAlbums, validatorUploads) {
    this.#storageService = storageService;
    this.#albumsService = albumsService;
    this.#likeService = likeService;
    this.#validatorAlbums = validatorAlbums;
    this.#validatorUploads = validatorUploads;

    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    const validatedAlbumPayload = this.#validatorAlbums.validateAlbumPayload(request.payload);

    const { name, year } = validatedAlbumPayload;

    const data = await this.#albumsService.postAlbum(name, year);

    const response = h.response({
      status: 'success',
      data,
    });
    response.code(201);

    return response;
  }

  async getAlbumByIdHandler(request, h) {
    const { id } = request.params;

    const album = await this.#albumsService.getAlbumById(id);

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

    const validatedAlbumPayload = this.#validatorAlbums.validateAlbumPayload(request.payload);

    const { name, year } = validatedAlbumPayload;
    await this.#albumsService.putAlbumById(id, name, year);

    const response = h.response({
      status: 'success',
      message: 'Album berhasil diperbarui.',
    });
    response.code(200);

    return response;
  }

  async deleteAlbumByIdHandler(request, h) {
    const { id } = request.params;

    await this.#albumsService.deleteAlbumById(id);

    const response = h.response({
      status: 'success',
      message: 'Album berhasil dihapus.',
    });
    response.code(200);

    return response;
  }

  async postAlbumCoverByIdHandler(request, h) {
    const { id: albumId } = request.params;
    const { cover } = request.payload;
    const { hapi: meta } = cover;
    const { headers } = meta;

    this.#validatorUploads.validateUploadPayload(headers);

    const fileName = await this.#storageService.writeFileCover(cover, meta);

    await this.#albumsService.addCoverAlbum(albumId, fileName);

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    });
    response.code(201);

    return response;
  }

  async postLikeAlbumHandler(request, h) {
    const { userId } = request.auth.credentials;
    const { id: albumId } = request.params;

    await this.#likeService.postLikeAlbum(albumId, userId);

    const response = h.response({
      status: 'success',
      message: 'Berhasil menyukai album',
    });
    response.code(201);

    return response;
  }

  async deleteLikeAlbumHandler(request, h) {
    const { userId } = request.auth.credentials;
    const { id: albumId } = request.params;

    await this.#likeService.deleteLikeAlbum(albumId, userId);

    const response = h.response({
      status: 'success',
      message: 'Berhasil batal menyukai album',
    });
    response.code(200);

    return response;
  }

  async getAlbumLikesHandler(request, h) {
    const { id: albumId } = request.params;

    const { isCache, likes } = await this.#likeService.getAlbumLikes(albumId);

    const response = h.response({
      status: 'success',
      data: {
        likes,
      },
    });
    if (isCache) {
      response.header('X-Data-Source', 'cache');
    }
    response.code(200);

    return response;
  }
}

module.exports = AlbumHandler;
