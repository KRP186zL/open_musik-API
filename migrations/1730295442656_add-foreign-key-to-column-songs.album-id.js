/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.sql("UPDATE albums SET album_id = 'unknown' WHERE album_id IS NULL");

  pgm.addConstraint(
    'songs',
    'fk_songs.album_id_albums.album_id',
    'FOREIGN KEY (album_id) REFERENCES albums(album_id) ON DELETE CASCADE'
  );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropConstraint('songs', 'fk_songs.album_id_albums.album_id');

  pgm.sql("UPDATE albums SET album_id = NULL WHERE album_id = 'unknown'");
};
