/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable('playlist_songs', {
    ps_id: {
      type: 'VARCHAR(19)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(25)',
      notNull: true,
    },
    song_id: {
      type: 'VARCHAR(21)',
      notNull: true,
    },
  });

  pgm.addConstraint(
    'playlist_songs',
    'fk_playlist_songs.playlist_id_playlists.playlist_id',
    'FOREIGN KEY (playlist_id) REFERENCES playlists(playlist_id) ON DELETE CASCADE'
  );

  pgm.addConstraint(
    'playlist_songs',
    'fk_playlist_songs.song_id_songs.song_id',
    'FOREIGN KEY (song_id) REFERENCES songs(song_id) ON DELETE CASCADE'
  );

  pgm.createConstraint(
    'playlist_songs',
    'unique_playlist_id_song_id',
    'UNIQUE (playlist_id, song_id)'
  );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable('playlist_songs');
};
