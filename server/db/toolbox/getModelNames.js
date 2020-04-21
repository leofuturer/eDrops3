/**
 * Read the content of /server/model-config.json and get all the model names
 * that need to connect to database.
 */

'use strict';

const _ = require('lodash');

//When we require an json file in js, the returned one is an object
const modelConfig = require('../../server/model-config.json');

module.exports = () => {
  const result = [];
  _.keys(modelConfig).forEach((key) => {
    if (modelConfig[key].dataSource === 'mysqlDS') {
      result.push(key);
    }
  });
  return result;
};
