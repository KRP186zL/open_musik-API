// Package
const { Pool } = require('pg');
const { nanoid } = require('nanoid');

// Custom Error
const InvariantError = require('../error/InvariantError');
const NotFoundError = require('../error/NotFoundError');
const AuthorizationError = require('../error/AuthorizationError');

class PlaylistsService {
  #pool;

  constructor() {
    this.#pool = new Pool();
  }

  async verifyPlaylistOwner(playlistId, credentialId) {
    const query = {
      text: 'SELECT owner FROM playlists WHERE playlist_id = $1',
      values: [playlistId],
    };

    const result = await this.#pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const { owner } = result.rows[0];

    if (owner !== credentialId) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async addPlaylist(name, owner) {
    const playlistId = `playlist-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlists VALUES ($1, $2, $3) RETURNING playlist_id as "playlistId"',
      values: [playlistId, name, owner],
    };

    const result = await this.#pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Gagal menambahkan playlist');
    }

    return result.rows[0].playlistId;
  }

  async getPlaylists(owner) {
    const query = {
      text: `SELECT playlists.playlist_id as id, playlists.name, users.username
      FROM playlists
      INNER JOIN users
      ON playlists.owner = users.user_id
      WHERE playlists.owner = $1`,
      values: [owner],
    };

    const result = await this.#pool.query(query);

    return result.rows;
  }

  async deletePlaylistById(playlistId) {
    const query = {
      text: 'DELETE FROM playlists WHERE playlist_id = $1',
      values: [playlistId],
    };

    await this.#pool.query(query);
  }

  async postPlaylistSong(playlistId, songId) {
    const psId = `ps-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlist_songs VALUES ($1, $2, $3) RETURNING ps_id',
      values: [psId, playlistId, songId],
    };

    const result = await this.#pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Gagal menambahkan lagu kedalam playlist');
    }
  }

  async getPlaylistSongs(playlistId) {
    const queryGetPlaylist = {
      text: `SELECT playlists.playlist_id as id, playlists.name, users.username
      FROM playlists
      INNER JOIN users
      ON playlists.owner = users.user_id
      WHERE playlists.playlist_id = $1`,
      values: [playlistId],
    };

    const queryGetSongs = {
      text: `SELECT songs.song_id as id, songs.title, songs.performer
      FROM playlist_songs
      INNER JOIN songs
      ON playlist_songs.song_id = songs.song_id
      WHERE playlist_songs.playlist_id = $1`,
      values: [playlistId],
    };

    const [playlist, songs] = await Promise.all([
      (await this.#pool.query(queryGetPlaylist)).rows[0],
      (await this.#pool.query(queryGetSongs)).rows,
    ]);

    if (!playlist) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    return {
      ...playlist,
      songs,
    };
  }

  async deletePlaylistSong(songId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE song_id = $1',
      values: [songId],
    };

    await this.#pool.query(query);
  }
}

module.exports = PlaylistsService;
