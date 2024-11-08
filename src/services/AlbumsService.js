const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../error/InvariantError');
const NotFoundError = require('../error/NotFoundError');

class AlbumService {
  #pool;

  constructor() {
    this.#pool = new Pool();
  }

  async postAlbum(name, year) {
    const id = `album-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO albums VALUES ($1, $2, $3, $4) RETURNING album_id as "albumId"',
      values: [id, name, year, null],
    };

    const result = await this.#pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Gagal menambahkan album.');
    }

    return result.rows[0];
  }

  async getAlbumById(id) {
    const queryAlbum = {
      text: 'SELECT album_id as id, name, year, cover_url as "coverUrl" FROM albums WHERE album_id = $1',
      values: [id],
    };

    const querySong = {
      text: 'SELECT song_id as id, title, year, performer, genre, duration, album_id as "albumId" FROM songs WHERE album_id = $1',
      values: [id],
    };

    const [album, songs] = await Promise.all([
      (await this.#pool.query(queryAlbum)).rows[0],
      (await this.#pool.query(querySong)).rows,
    ]);

    const albumWithSong = { ...album, songs };

    if (!album) {
      throw new NotFoundError('Album tidak ditemukan.');
    }

    return albumWithSong;
  }

  async putAlbumById(id, name, year) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE album_id = $3 RETURNING album_id',
      values: [name, year, id],
    };

    const result = await this.#pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album, id album tidak ditemukan.');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE album_id = $1 RETURNING album_id',
      values: [id],
    };

    const result = await this.#pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus album, id tidak ditemukan.');
    }
  }

  async addCoverAlbum(albumId, fileName) {
    const url = `http://${process.env.HOST}:${process.env.PORT}/albums/covers/${fileName}`;
    const query = {
      text: 'UPDATE albums SET cover_url = $1 WHERE album_id = $2 RETURNING cover_url as "coverUrl"',
      values: [url, albumId],
    };

    const result = await this.#pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Gagal menambahkan cover album');
    }
  }
}

module.exports = AlbumService;
