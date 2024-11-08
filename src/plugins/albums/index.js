const AlbumHandler = require('./handler');
const routes = require('./routes');

const AlbumsPlugin = {
  name: 'Albums',
  version: '1.0.0',
  register: (server, {
    storageService,
    albumsService,
    likeService,
    validatorAlbums,
    validatorUploads,
  }) => {
    const handler = new AlbumHandler(
      storageService,
      albumsService,
      likeService,
      validatorAlbums,
      validatorUploads,
    );
    server.route(routes(handler));
  },
};

module.exports = AlbumsPlugin;
