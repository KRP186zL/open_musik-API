const autoBind = require('auto-bind');

class UsersHandler {
  #service;

  #validator;

  constructor(service, validator) {
    this.#service = service;
    this.#validator = validator;

    autoBind(this);
  }

  async postUserHandler(request, h) {
    const validatedUserPayload = await this.#validator.validateUserPayload(request.payload);

    const { username, password, fullname } = validatedUserPayload;

    await this.#service.verifyUsername(username);

    const userId = await this.#service.addUser(username, password, fullname);

    const response = h.response({
      status: 'success',
      data: {
        userId,
      },
    });
    response.code(201);

    return response;
  }
}

module.exports = UsersHandler;
