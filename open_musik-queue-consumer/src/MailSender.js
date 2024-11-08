const nodemailer = require('nodemailer');

class MailSender {
  #transporter;

  constructor() {
    this.#transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendMail(targetEmail, content) {
    const message = {
      from: 'Open Musik',
      to: targetEmail,
      subject: 'Eksport Playlist',
      text: 'Telampir hasil dari eksport playlist',
      attachments: [
        {
          filename: 'playlist.json',
          content,
        },
      ],
    };

    return this.#transporter.sendMail(message);
  }
}

module.exports = MailSender;
