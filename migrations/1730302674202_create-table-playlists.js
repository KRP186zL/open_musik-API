/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable('playlists', {
    playlist_id: {
      type: 'VARCHAR(25)',
      primaryKey: true,
    },

    name: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(21)',
      notNull: true,
    },
  });

  pgm.addConstraint(
    'playlists',
    'fk_playlists.owner_users.user_id',
    'FOREIGN KEY (owner) REFERENCES users(user_id) ON DELETE CASCADE'
  );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable('playlists');
};
