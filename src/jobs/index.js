const ColissimoTrackingJob = require('./ColissimoTrackingJob');
const SimpleJob = require('./SimpleJob');

module.exports = async function(app){
  app.ColissimoTrackingJob = new ColissimoTrackingJob(app);
  app.SimpleJob = new SimpleJob(app);

  app.executeJob = async function(jobName){
    const job = app[jobName];
    if(!job){
      throw new Error(`Job '${jobName}' does not exist`);
    }
    await job.execute();
  };
};
