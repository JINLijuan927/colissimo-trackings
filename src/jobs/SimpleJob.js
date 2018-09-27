const Job = require('./Job');

class SimpleJob extends Job {
  constructor(app) {
    super(app, 'SimpleJob');
  }
}

module.exports = SimpleJob;
