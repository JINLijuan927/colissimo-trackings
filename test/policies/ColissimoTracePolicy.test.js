const ColissimoTrackingPolicy = require('../../src/policies/ColissimoTrackingPolicy');
const assert = require('assert');

describe('ColissimoTrackingPolicy', () => {
  it('parse()', () => {
    // TODO
  });
  it('getTrackingNumber()', async () => {
    const tracking = {
      event: 'LIV_CFM',
      timestamp: new Date()
    };
    const parcelHandler = () => ({});

    const newParcel = await ColissimoTrackingPolicy.updateParcelTimestamps(tracking, parcelHandler);
    assert.strictEqual(newParcel.deliveredAt, tracking.timestamp);
  });
  it('updateShipmentStatus()', async () => {
    // TODO
  });
  it('getTrackingNumber()', () => {
    // TODO
  });
  it('toUTCDate()', () => {
    // TODO
  });
  it('getEarlyDate()', () => {
    // TODO
  });
});
