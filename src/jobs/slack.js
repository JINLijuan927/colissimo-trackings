const {WebClient} = require('@slack/client');

module.exports = {
  /**
   * @link https://api.slack.com/methods/chat.postMessage
   * @param {Object} config
   * @param {String} config.channel
   * @param {String} config.token
   * @param {String} text
   * @return Promise
   */
  async send(config, text) {
    const {token, channel, username} = config;
    const client = new WebClient(token);
    return client.chat.postMessage({channel, username, text});
  }
};


