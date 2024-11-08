/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable('like_albums', {
    album_id: {
      type: 'VARCHAR(22)',
      primaryKey: true,
    },
    user_id: {
      type: 'VARCHAR(21)',
      primaryKey: true,
    },
  });

  pgm.addConstraint('like_albums', 'fk_like_albums.album_id_albums.album_id', 'FOREIGN KEY(album_id) REFERENCES albums(album_id) ON DELETE CASCADE');

  pgm.addConstraint('like_albums', 'fk_like_albums.user_id_users.user_id', 'FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable('like_albums');
};
