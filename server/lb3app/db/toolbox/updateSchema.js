
const Promise = require('bluebird');
const log = require('./log');
const server = require('../../server/server');

const dataSource = server.dataSources.mysqlDS;

// define migrate function

module.exports = (models) => {
  if (!models || !models.length) {
    log.error('No models found.');
    return Promise.resolve();
  }

  return Promise.each(models, (model) => new Promise((resolve, reject) => {
    dataSource.autoupdate(model, (err) => {
      if (err) reject(err);
      log.success(`updated schema for model ${model}.`);
      resolve();
    });
  })).then(() => {
    log.success('updated schema all models.');
    return Promise.resolve();
  }).catch((err) => {
    log.error('create schema failed');
    return Promise.reject(err);
  });
};

/* does not work right now!!
module.exports = async (models) => {
  if (!models || !models.length) {
    log.error('No models found.');
    return Promise.resolve();
  }

  const schemaUpdate = (mod) => {
    return new Promise((resolve, reject) => {
      dataSource.autoupdate(mod, (err) => {
        if (err) reject(err);
        console.log("111");
        log.success(`updated schema for model ${mod}.`);
        resolve();
      });
    });
  }

  try {
      console.log("222");
      await models.map( (model) => {
        console.log("333");
          schemaUpdate(model);
    });
  } catch(err) {
    log.error(err);
  }
}
*/
