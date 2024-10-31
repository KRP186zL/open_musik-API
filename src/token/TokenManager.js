const Jwt = require('@hapi/jwt');
const InvariantError = require('../error/InvariantError');

const TokenManager = {
  generateAccessToken: (payload) => Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY),
  generateRefreshToken: (payload) => Jwt.token.generate(payload, process.env.REFRESH_TOKEN_KEY),
  verifyRefreshToken: (payload) => {
    try {
      const artifact = Jwt.token.decode(payload);

      Jwt.token.verifySignature(artifact, process.env.REFRESH_TOKEN_KEY);

      const { userId } = artifact.decoded.payload;

      return userId;
    } catch {
      throw new InvariantError('Refresh Token tidak valid');
    }
  },
};

module.exports = TokenManager;
