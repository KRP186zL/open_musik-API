require('dotenv').config();

const Hapi = require('@hapi/hapi');
const albumPlugin = require('./plugins/album');
const songsPlugin = require('./plugins/song');
const AlbumService = require('./services/album/AlbumService');
const SongService = require('./services/song/SongService');
const ClientError = require('./error/ClientError');
const AlbumValidator = require('./validator/album');
const SongValidator = require('./validator/song');

(async () => {
  const albumService = new AlbumService();
  const songService = new SongService();

  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT,
    routes: {
      cors: true,
    },
  });

  await server.register([
    {
      plugin: albumPlugin,
      options: {
        service: albumService,
        validator: AlbumValidator,
      },
    },
    {
      plugin: songsPlugin,
      options: {
        service: songService,
        validator: SongValidator,
      },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof Error) {
      const newResponse = h.response({
        status: response instanceof ClientError ? 'fail' : 'error',
        message: response.message,
      });
      newResponse.code(response.statusCode);

      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
})();
