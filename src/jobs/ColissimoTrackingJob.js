const Job = require('./Job');
const SFTP = require('./sftp');
const Slack = require('./slack');
const ColissimoTrackingPolicy = require('../policies/ColissimoTrackingPolicy');

class ColissimoTrackingJob extends Job {
  constructor(app) {
    super(app, 'ColissimoTrackingJob');
    this.config = app.get('job').COLISSIMO;
  }

  /**
   * Handle tracking files from SFTP.
   * @returns {Promise<*|Promise<void>>}
   * @private
   */
  async _handle() {
    const folder = this.config.sftp.path;
    return SFTP.instance(this.config.sftp, async (sftp) => {
      // move retry files to root folder
      await this._moveRetryFilesToRoot(sftp, folder);

      // handle files
      // TODO optimize list only files in folder
      // TODO sftp take account folder in config
      const fileOrFolders = await sftp.list(folder);
      const files = fileOrFolders.filter((file) => file.type !== 'd').sort();
      for (let file of files) {
        // handler files
        if (file.name.endsWith('.ok') && !file.name.startsWith('INVOIC')) {
          // tracking files handling goes here
          try {
            const csvData = await sftp.getAsCSV(`${folder}/${file.name}`);
            await this._saveTrackings(csvData.data);
            await sftp.rename(`${folder}/${file.name}`, `${folder}/success/${file.name}`);
            await Slack.send(this.config.slack, 'test');
          } catch (err) {
            console.error(err);
            await sftp.rename(`${folder}/${file.name}`, `${folder}/retry/${file.name}`);
          }
        } else if (file.name.startsWith('INVOIC')) {
          // invoice files handling goes here
          await sftp.rename(`${folder}/${file.name}`, `${folder}/invoices/${file.name}`);
        } else {
          // dat files handling goes here
          await sftp.rename(`${folder}/${file.name}`, `${folder}/dat/${file.name}`);
        }
      }
    });
  }

  async _moveRetryFilesToRoot(sftp, folder){
    const files = await sftp.list(`${folder}/retry`);
    for (let file of files) {
      await sftp.rename(`${folder}/retry/${file.name}`, `${folder}/${file.name}`);
    }
  }

  /**
   * Save tracking and update parcel and shipment timestamps
   * @param {Array} rawTrackings
   * @returns {Promise<void>}
   * @private
   */
  async _saveTrackings(rawTrackings) {
    const trackings = ColissimoTrackingPolicy.parse(rawTrackings);

    // save all trackings to database
    const TrackingModel = this.app.models['tracking'];
    // TODO use filed name instead of model name
    await TrackingModel.bulkCreate(trackings, {onConflict: ['trackingnumber', 'timestamp']});

    for(let tracking of trackings){
      const p1 = this._updateShipmentStatus(tracking);
      const p2 = this._updateParcelTimestamps(tracking);
      await Promise.all([p1, p2]);
    }

  }

  /**
   * Update Shipment status by tracking
   * @param tracking
   * @returns {Promise<void>}
   * @private
   */
  async _updateShipmentStatus(tracking){
    const ShipmentModel = this.models.shipment;

    const shipment = ColissimoTrackingPolicy.updateShipmentStatus(tracking, () => {
      const query = {where: {trackingNumber: tracking.trackingNumber}};
      return ShipmentModel.findOne(query);
    });
    if(shipment){
      await ShipmentModel.save(shipment);
    }
  }

  /**
   * Update Parcel timestamps by tracking
   * @param tracking
   * @returns {Promise<void>}
   * @private
   */
  async _updateParcelTimestamps(tracking){
    const ParcelModel = this.app.models['parcel'];

    const parcel = ColissimoTrackingPolicy.updateParcelTimestamps(tracking, () => {
      const query = {where: {trackingNumber: tracking.trackingNumber}};
      return ParcelModel.findOne(query);
    });
    if(parcel){
      await ParcelModel.save(parcel);
    }
  }
}

module.exports = ColissimoTrackingJob;
