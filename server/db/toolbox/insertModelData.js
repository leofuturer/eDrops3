/**
 * insert json data into a model
 */

'use strict';

const Promise = require('bluebird');

module.exports = (Model, data) => new Promise((resolve, reject) => {
  Model.create(data, (err, data) => {
    if (err) reject(err);
    resolve(data);
  });
});
