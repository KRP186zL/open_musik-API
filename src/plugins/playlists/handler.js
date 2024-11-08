const autoBind = require('auto-bind');

class PlaylistsHandler {
  #playlistsService;

  #songsService;

  #validator;

  constructor(playlistsService, songsService, validator) {
    this.#playlistsService = playlistsService;
    this.#songsService = songsService;
    this.#validator = validator;

    autoBind(this);
  }

  async postPlaylistHandler(request, h) {
    const validatedPostPlaylistPayload = this.#validator.validatePostPlaylistPayload(
      request.payload,
    );

    const { name } = validatedPostPlaylistPayload;
    const { userId: owner } = request.auth.credentials;

    const playlistId = await this.#playlistsService.addPlaylist(name, owner);

    const response = h.response({
      status: 'success',
      data: {
        playlistId,
      },
    });
    response.code(201);

    return response;
  }

  async getPlaylistsHandler(request, h) {
    const { userId: credentialId } = request.auth.credentials;

    const playlists = await this.#playlistsService.getPlaylists(credentialId);

    const response = h.response({
      status: 'success',
      data: {
        playlists,
      },
    });
    response.code(200);

    return response;
  }

  async deletePlaylistByIdHandler(request, h) {
    const { id: playlistId } = request.params;
    const { userId: credentialId } = request.auth.credentials;

    await this.#playlistsService.verifyPlaylistOwner(playlistId, credentialId);

    await this.#playlistsService.deletePlaylistById(playlistId);

    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil dihapus',
    });
    response.code(200);

    return response;
  }

  async postPlaylistSongHandler(request, h) {
    const validatedPostPlaylistSongPayload = await this.#validator.validatePostPlaylistSongPayload(
      request.payload,
    );

    const { songId } = validatedPostPlaylistSongPayload;
    const { id: playlistId } = request.params;
    const { userId: credentialId } = request.auth.credentials;

    await this.#songsService.getSongById(songId);
    await this.#playlistsService.verifyPlaylistOwner(playlistId, credentialId);

    await this.#playlistsService.postPlaylistSong(playlistId, songId);

    const response = h.response({
      status: 'success',
      message: 'song berhasil ditambahkan kedalam playlist',
    });
    response.code(201);

    return response;
  }

  async getPlaylistSongHandler(request, h) {
    const { id: playlistId } = request.params;
    const { userId: credentialId } = request.auth.credentials;

    await this.#playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    const playlist = await this.#playlistsService.getPlaylistSongs(playlistId);

    const response = h.response({
      status: 'success',
      data: {
        playlist,
      },
    });
    response.code(200);

    return response;
  }

  async deletePlaylistSongHandler(request, h) {
    const validatedDeletePlaylistPayload = this.#validator.validateDeletePlaylistSongPayload(
      request.payload,
    );

    const { songId } = validatedDeletePlaylistPayload;
    const { id: playlistId } = request.params;
    const { userId: credentialId } = request.auth.credentials;

    await this.#playlistsService.verifyPlaylistOwner(playlistId, credentialId);

    await this.#playlistsService.deletePlaylistSong(songId);

    const response = h.response({
      status: 'success',
      message: 'Song berhasil dihapus dari playlist',
    });
    response.code(200);

    return response;
  }
}

module.exports = PlaylistsHandler;
