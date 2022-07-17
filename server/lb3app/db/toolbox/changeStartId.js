const Promise = require('bluebird');
const log = require('./log');
const server = require('../../server/server');

const dataSource = server.dataSources.mysqlDS;

// define migrate function
module.exports = (userModels) => {
  console.log(userModels);
  if (!userModels) {
    log.info('[changeStartId.js] No models found.');
    return Promise.resolve();
  }

  return Promise.each(Object.entries(userModels), (model) => new Promise((resolve, reject) => {
    let updateTableStatement = `ALTER TABLE ${model[0]} AUTO_INCREMENT=${model[1]};`;
    dataSource.connector.execute(updateTableStatement, [], (err) => {
      if(err){
        log.error(`Change start id of auto_increment failed for ${model[0]}: ${err}`);
        reject(err);
      } else {
        log.success(`Updated auto_increment of ${model[0]} to ${model[1]}`);
        resolve();
      }
    });
  })).then(() => {
    log.success(`Updated start id of auto_increment for all models`);
    return Promise.resolve();
  }).catch((err) => {
    log.error(`Change start_id of auto_increment`);
    return Promise.reject(err);
  });
};
