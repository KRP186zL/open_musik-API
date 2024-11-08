const routes = (handler) => [
  {
    method: 'POST',
    path: '/export/playlists/{playlistId}',
    handler: handler.postExportHandler,
    options: {
      auth: 'open-musik_jwt',
    },
  },
];

module.exports = routes;
