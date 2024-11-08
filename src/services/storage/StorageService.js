const fs = require('fs');

class StorageService {
  #folder;

  constructor(folder) {
    this.#folder = folder;

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
  }

  async writeFileCover(file, meta) {
    const fileName = +new Date() + meta.filename;
    const path = `${this.#folder}/${fileName}`;

    const fileStream = fs.createWriteStream(path);

    return new Promise((resolve, reject) => {
      fileStream.on('error', (err) => reject(err));

      file.pipe(fileStream);

      file.on('end', () => resolve(fileName));
    });
  }
}

module.exports = StorageService;
