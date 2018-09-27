class Job {
  constructor(app, name) {
    this.app = app;
    this.name = name;
  }

  async _before(){
    console.log('Job Started');
  }
  async _handle(){
    console.log('Job Executing');
  }
  async _after(){
    console.log('Job Finished');
  }

  async execute(){
    // find the job
    const query = {
      where: {name: this.name},
      defaults: {name: this.name, status: 'PENDING'}
    };
    const [job] = await this.app.models.job.findOrCreate(query);

    // do nothing if job is executing
    // if(job.status === 'EXECUTING'){
    //   console.log('Job Executing');
    //   return;
    // }

    // execute the job if not executing
    try {
      job.status = 'EXECUTING';
      await job.save();

      await this._before();
      await this._handle();
      await this._after();
      job.status = 'SUCCESS';
    }catch(err){
      job.status = 'FAIL';
    }
    await job.save();
  }
}

module.exports = Job;

