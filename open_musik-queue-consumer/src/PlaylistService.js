const { Pool } = require('pg');

class PlaylistService {
  #pool;

  constructor() {
    this.#pool = new Pool();
  }

  async getPlaylistSongs(playlistId) {
    const queryGetPlaylist = {
      text: `SELECT playlist_id as id, name
      FROM playlists
      WHERE playlist_id = $1`,
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

    return {
      playlist: {
        ...playlist,
        songs,
      },
    };
  }
}

module.exports = PlaylistService;
