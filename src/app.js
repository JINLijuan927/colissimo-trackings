const feathers = require('@feathersjs/feathers');
const configuration = require('@feathersjs/configuration');
const orm = require('./orm');
const jobs = require('./jobs');

const app = feathers()
  .configure(configuration())
  .configure(orm)
  .configure(jobs);

module.exports = app;
