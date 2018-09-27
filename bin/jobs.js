#!/usr/bin/env node

const app = require('../src/app');

const [,, ...args] = process.argv;

const jobName = args[0];

app.initData()
  .then(() => app.executeJob(jobName))
  .then(() => process.exit())
  .catch((error) => {
    console.error(error);
    process.exit();
  });


