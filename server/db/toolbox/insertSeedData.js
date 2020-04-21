/**
 * insert a map of seed data into database
 */

'use strict';

const _ = require('lodash');
const Promise = require('bluebird');
const server = require('../../server/server');
const insertModelData = require('./insertModelData');
const log = require('./log');

module.exports = seedData => new Promise((resolve, reject) => {
  const insertPromises = [];

  _.map(seedData, (modelSeedData, modelName) => {
    const promise = insertModelData(server.models[modelName], seedData[modelName]);
    promise.then(() => {
      log.success(`inserted seed data for model: ${modelName}`);
    }).catch((err) => {
      log.error(`inserted seed data for model: ${modelName} failed`);
      reject(err);
    });

    insertPromises.push(promise);
  });

  Promise.all(insertPromises).then(() => {
    resolve();
  });
});
