const app = require('../../src/app');

describe('ColissimoTrackingJob', () => {
  it('execute()', async () => {

    // TODO prepare data
    await app.initData();

    // do job
    await app.ColissimoTrackingJob.execute();

    // check result
    // app.models.tracking
    // app.models.parcel
    // app.models.shipment
  });
});
