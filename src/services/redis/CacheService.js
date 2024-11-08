const redis = require('redis');
const NotFoundError = require('../../error/NotFoundError');

class CacheService {
  #client;

  constructor() {
    this.#client = redis.createClient({
      socket: {
        host: process.env.REDIS_SERVER,
      },
    });

    this.#client.on('error', (err) => {
      console.log(err);
    });

    this.#client.connect();
  }

  async set(key, value, expirationInSecond = 1800) {
    await this.#client.set(key, value, {
      EX: expirationInSecond,
    });
  }

  async get(key) {
    const result = await this.#client.get(key);

    if (result === null) throw new NotFoundError('Cache tidak ditemukan');

    return result;
  }

  async delete(key) {
    await this.#client.del(key);
  }
}

module.exports = CacheService;
