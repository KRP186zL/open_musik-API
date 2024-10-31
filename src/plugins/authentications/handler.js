const autoBind = require('auto-bind');

class AuthenticationsHandler {
  #usersService;

  #authenticationsService;

  #tokenManager;

  #validator;

  constructor(usersService, authenticationsService, tokenManager, validator) {
    this.#usersService = usersService;
    this.#authenticationsService = authenticationsService;
    this.#tokenManager = tokenManager;
    this.#validator = validator;

    autoBind(this);
  }

  async postAuthenticationHandler(request, h) {
    const validatedPostPayloadAuthentication = this.#validator.validatePostPayloadAuthentication(
      request.payload,
    );

    const { username, password } = validatedPostPayloadAuthentication;

    const userId = await this.#usersService.verifyCredentialUser(username, password);

    const accessToken = this.#tokenManager.generateAccessToken({ userId });
    const refreshToken = this.#tokenManager.generateRefreshToken({ userId });

    await this.#authenticationsService.postAuthentication(refreshToken);

    const response = h.response({
      status: 'success',
      data: {
        accessToken,
        refreshToken,
      },
    });
    response.code(201);

    return response;
  }

  async putAuthenticationHandler(request, h) {
    const validatedPutPayloadAuthentication = this.#validator.validatePutPayloadAuthentication(
      request.payload,
    );

    const { refreshToken } = validatedPutPayloadAuthentication;

    await this.#authenticationsService.verifyRefreshToken(refreshToken);

    const userId = this.#tokenManager.verifyRefreshToken(refreshToken);

    const newAccessToken = this.#tokenManager.generateAccessToken({ userId });

    const response = h.response({
      status: 'success',
      data: {
        accessToken: newAccessToken,
      },
    });
    response.code(200);

    return response;
  }

  async deleteAuthenticationHandler(request, h) {
    const validatedDeletePayload = await this.#validator.validateDeletePayloadAuthentication(
      request.payload,
    );

    const { refreshToken } = validatedDeletePayload;

    await this.#authenticationsService.verifyRefreshToken(refreshToken);

    await this.#authenticationsService.deleteAuthentication(refreshToken);

    const response = h.response({
      status: 'success',
      message: 'Refresh Token berhasil dihapus',
    });
    response.code(200);

    return response;
  }
}

module.exports = AuthenticationsHandler;
