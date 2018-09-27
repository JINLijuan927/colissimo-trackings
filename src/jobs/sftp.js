const SFTP = require('@softbrains/ssh2-sftp-client');
const papa = require('papaparse');

SFTP.prototype.getAsCSV = async function(remotePath){
  const stream = await this.get(remotePath);
  stream.read();
  return new Promise((resolve, reject) => {
    papa.parse(stream, {
      header: false,
      delimiter: ';',
      skipEmptyLines: true,
      complete(result) {
        const {data, meta: {fields: header}} = result;
        resolve({header, data});
      },
      error(error) {
        reject(error);
      }
    });
  });
};

module.exports = {
  async instance(config, handler){
    const sftp = new SFTP();
    await sftp.connect(config);
    try {
      await handler(sftp);
    } catch (err) {
      console.log(err);
    }
    await sftp.end();
  }
};
