const AlbumHandler = require('./handler');
const routes = require('./routes');

const AlbumsPlugin = {
  name: 'Albums',
  version: '1.0.0',
  register: (server, { service, validator }) => {
    const handler = new AlbumHandler(service, validator);
    server.route(routes(handler));
  },
};

module.exports = AlbumsPlugin;
