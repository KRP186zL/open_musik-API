require('dotenv').config();

// Package
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

// Custom Error
const ClientError = require('./error/ClientError');

// Token Manager
const TokenManager = require('./token/TokenManager');

// Albums plugin
const albumsPlugin = require('./plugins/albums');
const AlbumsService = require('./services/AlbumsService');
const ValidatorAlbums = require('./validator/albums');

// Songs Plugin
const songsPlugin = require('./plugins/songs');
const SongsService = require('./services/SongsService');
const ValidatorSongs = require('./validator/songs');

// Users Plugin
const usersPlugin = require('./plugins/users');
const UsersService = require('./services/UsersService');
const ValidatorUsers = require('./validator/users');

// Authentications Plugin
const authenticationsPlugin = require('./plugins/authentications');
const AuthenticationsService = require('./services/AuthenticationsService');
const ValidatorAuthentications = require('./validator/authentications');

// Playlists Plugin
const playlistsPlugin = require('./plugins/playlists');
const PlaylistsService = require('./services/PlaylistsService');
const ValidatorPlaylists = require('./validator/playlists');

(async () => {
  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const playlistsService = new PlaylistsService();

  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT,
    routes: {
      cors: true,
    },
  });

  // Eksternal Plugin
  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  server.auth.strategy('open-musik_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        userId: artifacts.decoded.payload.userId,
      },
    }),
  });

  // Internal Plugin
  await server.register([
    {
      plugin: albumsPlugin,
      options: {
        service: albumsService,
        validator: ValidatorAlbums,
      },
    },
    {
      plugin: songsPlugin,
      options: {
        service: songsService,
        validator: ValidatorSongs,
      },
    },
    {
      plugin: usersPlugin,
      options: {
        service: usersService,
        validator: ValidatorUsers,
      },
    },
    {
      plugin: authenticationsPlugin,
      options: {
        usersService,
        authenticationsService,
        tokenManager: TokenManager,
        validator: ValidatorAuthentications,
      },
    },
    {
      plugin: playlistsPlugin,
      options: {
        playlistsService,
        songsService,
        validator: ValidatorPlaylists,
      },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request;
    // console.log('\n\n\n', response.stack);

    if (response instanceof Error) {
      // penanganan client error secara internal.
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }

      // mempertahankan penanganan client error oleh hapi secara native, seperti 404, etc.
      if (!response.isServer) {
        return h.continue;
      }

      // penanganan server error sesuai kebutuhan
      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami',
      });
      newResponse.code(500);
      return newResponse;
    }

    // jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
})();
