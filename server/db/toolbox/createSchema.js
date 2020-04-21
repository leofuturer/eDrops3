'use strict';

const Promise = require('bluebird');
const log = require('./log');
const server = require('../../server/server');

const dataSource = server.dataSources.mysqlDS;

// define migrate function
module.exports = (models) => {
  if (!models || !models.length) {
    console.log('[createSchema.js] No models found.');
    return Promise.resolve();
  }

  return Promise.each(models, model => new Promise((resolve, reject) => {
    dataSource.automigrate(model, (err) => {
      if (err) {
        reject(err);
      }  else {
        log.success(`created schema for model ${model}.`);
        resolve();
      }
    });
  })).then(() => {
    log.success('created schema all models.');
    return Promise.resolve();
  }).catch((err) => {
    log.error('create schema failed');
    return Promise.reject(err);
  });
};
