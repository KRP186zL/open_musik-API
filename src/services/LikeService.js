const { Pool } = require('pg');
const ClientError = require('../error/ClientError');
const NotFoundError = require('../error/NotFoundError');

class LikeService {
  #pool;

  #cacheService;

  constructor(cacheService) {
    this.#pool = new Pool();
    this.#cacheService = cacheService;
  }

  async postLikeAlbum(albumId, userId) {
    const queryGetAlbumId = {
      text: 'SELECT album_id FROM albums WHERE album_id = $1',
      values: [albumId],
    };

    const result = await this.#pool.query(queryGetAlbumId);

    if (!result.rowCount) {
      throw new NotFoundError('Album id tidak ditemukan');
    }

    const queryPotsLikeAlbum = {
      text: 'INSERT INTO like_albums VALUES ($1, $2) RETURNING album_id',
      values: [albumId, userId],
    };

    try {
      await this.#pool.query(queryPotsLikeAlbum);
    } catch {
      throw new ClientError('Gagal menyukai album');
    }

    await this.#cacheService.delete(`likes-${albumId}`);
  }

  async deleteLikeAlbum(albumId, userId) {
    const query = {
      text: 'DELETE FROM like_albums WHERE album_id = $1 AND user_id = $2',
      values: [albumId, userId],
    };

    await this.#pool.query(query);
    await this.#cacheService.delete(`likes-${albumId}`);
  }

  async getAlbumLikes(albumId) {
    try {
      const result = await this.#cacheService.get(`likes-${albumId}`);
      return {
        isCache: true,
        likes: Number(result),
      };
    } catch {
      const query = {
        text: 'SELECT * FROM like_albums WHERE album_id = $1',
        values: [albumId],
      };
      const result = await this.#pool.query(query);
      await this.#cacheService.set(`likes-${albumId}`, result.rowCount);
      return {
        isCache: false,
        likes: result.rowCount,
      };
    }
  }
}

module.exports = LikeService;
