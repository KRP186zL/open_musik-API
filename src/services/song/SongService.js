const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../error/InvariantError');
const NotFoundError = require('../../error/NotFoundError');

class SongService {
  #pool;

  constructor() {
    this.#pool = new Pool();
  }

  async postSong({
    title, year, genre, performer, duration, albumId,
  }) {
    const id = `song-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO song VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING song_id as "songId"',
      values: [id, title, year, performer, genre, duration ?? null, albumId ?? null],
    };

    const result = await this.#pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Gagal menambahkan song.');
    }

    return result.rows[0];
  }

  async getSong({ title, performer }) {
    const query = 'SELECT song_id as id, title, performer FROM song';
    const result = await this.#pool.query(query);

    return result.rows.filter((song) => {
      if (title && !song.title.toLowerCase().includes(title.toLowerCase())) {
        return false;
      }
      if (performer && !song.performer.toLowerCase().includes(performer.toLowerCase())) {
        return false;
      }

      return true;
    });
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT song_id as id, title, year, performer, genre, duration, album_id as "albumId" FROM song WHERE song_id = $1',
      values: [id],
    };

    const result = await this.#pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Song tidak ditemukan.');
    }

    return result.rows[0];
  }

  async putSongById(id, {
    title, year, genre, performer, duration, albumId,
  }) {
    const query = {
      text: 'UPDATE song SET title = $1, year = $2, performer = $3, genre = $4, duration = COALESCE($5, duration), album_id = COALESCE($6, album_id) WHERE song_id = $7 RETURNING song_id',
      values: [title, year, performer, genre, duration ?? null, albumId ?? null, id],
    };

    const result = await this.#pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui song, id song tidak ditemukan.');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM song WHERE song_id = $1 RETURNING song_id',
      values: [id],
    };

    const result = await this.#pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus song, id song tidak ditemukan.');
    }
  }
}

module.exports = SongService;
