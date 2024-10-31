// Package
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

// Custom Error
const InvariantError = require('../error/InvariantError');
const AuthenticationError = require('../error/AuthenticationError');

class UsersService {
  #pool;

  constructor() {
    this.#pool = new Pool();
  }

  async verifyCredentialUser(username, password) {
    const query = {
      text: 'SELECT user_id as "userId", password FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this.#pool.query(query);

    if (!result.rows.length) {
      throw new AuthenticationError('Kredential yang anda masukkan tidak valid');
    }

    const { password: hashedPassword } = result.rows[0];

    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError('Kredential yang anda masukkan tidak valid');
    }

    return result.rows[0].userId;
  }

  async verifyUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this.#pool.query(query);

    if (result.rows.length > 0) {
      throw new InvariantError('Username sudah digunakan');
    }
  }

  async addUser(username, password, fullname) {
    const userId = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = {
      text: 'INSERT INTO users VALUES ($1, $2, $3, $4) RETURNING user_id as "userId"',
      values: [userId, username, hashedPassword, fullname],
    };

    const result = await this.#pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Gagal menambahkan user');
    }

    return result.rows[0].userId;
  }
}

module.exports = UsersService;
