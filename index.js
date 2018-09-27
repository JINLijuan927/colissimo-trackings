const app = require('./src/app');

const [,, ...args] = process.argv;

const jobName = args[0];

app.initData()
  .then(() => app.executeJob(jobName))
  .catch(console.error);
