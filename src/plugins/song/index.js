const SongHandler = require('./handler');
const routes = require('./routes');

const SongsPlugin = {
  name: 'Songs',
  version: '1.0.0',
  register: (server, { service, validator }) => {
    const handler = new SongHandler(service, validator);
    server.route(routes(handler));
  },
};

module.exports = SongsPlugin;
