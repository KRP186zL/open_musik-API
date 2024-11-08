const autoBind = require('auto-bind');

class ExportsHandler {
  #producerService;

  #playlistsService;

  #validator;

  constructor(producerService, playlistsService, validator) {
    this.#producerService = producerService;
    this.#validator = validator;
    this.#playlistsService = playlistsService;

    autoBind(this);
  }

  async postExportHandler(request, h) {
    const validatepayload = await this.#validator.validateExportPayload(request.payload);

    const { userId: credentialId } = request.auth.credentials;
    const { playlistId } = request.params;
    const { targetEmail } = validatepayload;

    await this.#playlistsService.verifyPlaylistOwner(playlistId, credentialId);

    const message = {
      playlistId,
      targetEmail,
    };

    await this.#producerService.sendMessage('export:playlist', JSON.stringify(message));

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    });
    response.code(201);

    return response;
  }
}

module.exports = ExportsHandler;
