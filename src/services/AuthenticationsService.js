const { Pool } = require('pg');
// const bcrypt = require('bcrypt');
const InvariantError = require('../error/InvariantError');

class AuthenticationsService {
  #pool;

  constructor() {
    this.#pool = new Pool();
  }

  // verifyUserAccess(token){

  // }

  async postAuthentication(token) {
    const query = {
      text: 'INSERT INTO authentications VALUES ($1) RETURNING token',
      values: [token],
    };

    const result = await this.#pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Gagal menambahkan Refresh Token');
    }
  }

  async verifyRefreshToken(token) {
    const query = {
      text: 'SELECT token from authentications WHERE token = $1',
      values: [token],
    };

    const result = await this.#pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Refresh token tidak valid');
    }
  }

  async deleteAuthentication(token) {
    const query = {
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [token],
    };

    await this.#pool.query(query);
  }
}

module.exports = AuthenticationsService;
