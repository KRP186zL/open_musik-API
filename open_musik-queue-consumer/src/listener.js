const autoBind = require('auto-bind');

class Listener {
  #playlistService;

  #mailSender;

  constructor(playlistService, mailSender) {
    this.#playlistService = playlistService;
    this.#mailSender = mailSender;

    autoBind(this);
  }

  async listen(message) {
    try {
      const { playlistId, targetEmail } = JSON.parse(message.content.toString());

      const playlist = await this.#playlistService.getPlaylistSongs(playlistId);
      const result = await this.#mailSender.sendMail(targetEmail, JSON.stringify(playlist));

      console.log(result);
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = Listener;
