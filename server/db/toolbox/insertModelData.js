/**
 * insert json data into a model
 */

const Promise = require('bluebird');

module.exports = (Model, data) => new Promise((resolve, reject) => {
  Model.create(data, (err, data) => {
    if (err) reject(err);
    resolve(data);
  });
});
