const moment = require('moment-timezone');
const _ = require('lodash');
const I18n = require('../i18n/i18n');

module.exports = {
  parse, getTrackingNumber, updateParcelTimestamps, updateShipmentStatus, getEarlyDate
};

function parse(rawTrackings) {
  return rawTrackings.map((item) => {
    const event = `${item[4]}_${item[5]}`;
    return {
      trackingNumber: getTrackingNumber(item[1], item[2]),
      reference: _.trim(item[3]),
      event: event,
      description: I18n.__(event),
      timestamp: toUTCDate(item[6]),
      location: `${item[8]},${item[9]}`,
    };
  });
}

/**
 * Convert timestamp string of timezone Paris to Date object of timezone UTC
 * @param {String} time in france
 * @returns {Date}
 */
function toUTCDate(time) {
  return moment.tz(time, 'YYYYMMDDHH:mm', 'Europe/Paris').toDate();
}

/**
 * Get tracking number by combining product part and tracking part
 * @param {String} productPart
 * @param {String} trackingPart
 * @returns {string}
 */
function getTrackingNumber(productPart, trackingPart) {
  return `${productPart}${trackingPart}${getControlKey(trackingPart)}`;
}

/**
 * Get control key by tracking part
 * @param {String} trackingPart
 * @returns {number}
 */
function getControlKey(trackingPart) {
  const trackArray = trackingPart.split('');
  let total = 0;
  const number = trackArray.map(Number);
  number.forEach((item, index) => {
    if ((index + 1) % 2 === 0) {
      total += item * 3;
    } else {
      total += item;
    }
  });
  return (10 - (total % 10)) % 10;
}

/**
 * Update parcel DScan and AScan by tracking
 *
 * @link com.ftl.oms.service.ParcelService.updateParcelOnlineRateColissimo (Line 38)
 * @param {Object} tracking
 * @param {Function} parcelSupplier
 * @returns {Promise<Object>}
 */
async function updateParcelTimestamps(tracking, parcelSupplier){
  if(tracking != null && ['LIV_CFM', 'PCH_CFM', 'AAR_CFM'].includes(tracking.event)) {
    const parcel = await parcelSupplier();
    if(parcel){
      if ('LIV_CFM' === tracking.event) {
        parcel.deliveredAt = getEarlyDate(parcel.deliveredAt, tracking.timestamp);
      }
      if ('PCH_CFM' === tracking.event || (!parcel.onlinedAt && 'AAR_CFM' === tracking.event)) {
        parcel.onlinedAt = getEarlyDate(parcel.onlinedAt, tracking.timestamp);
      }
      return parcel;
    }
  }
  return null;
}

/**
 * Update shipment status by tracking
 * @param {Object} tracking
 * @param {Function} shipmentSupplier
 * @returns {Promise<Object>}
 */
async function updateShipmentStatus(tracking, shipmentSupplier){
  if(tracking != null && ['PCH_CFM', 'LIV_REO', 'LIV_CFM'].includes(tracking.event)) {
    const shipment = await shipmentSupplier();
    if(shipment) {
      if (['PCH_CFM', 'AAR_CFM'].includes(tracking.event) && !['RETURNED', 'ARRIVED', 'DELIVERING'].includes(shipment.status)) {
        shipment.status = 'DELIVERING';
      } else if ('LIV_REO' === tracking.event) {
        shipment.status = 'RETURNED';
      } else if ('LIV_CFM' === tracking.event) {
        shipment.status = 'ARRIVED';
      }
      return shipment;
    }
  }
  return null;
}

function getEarlyDate(d1, d2){
  return (d1 !== null && d1 < d2) ? d1 : d2;
}
