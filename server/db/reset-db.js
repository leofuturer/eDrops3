/**
 * Reset the whole database to latest version of application state.
 *
 * NOTES:
 *   You will need MySQL root privilege to execute this scripts.
 *
 *
 * **IMPORTANT**
 *   NEVER USE THIS IN PRODUCTION.
 */

'use strict';

const _ = require('lodash');
const createSchema = require('./toolbox/createSchema');
const getModelNames = require('./toolbox/getModelNames');
const getSeedData = require('./toolbox/getSeedData');
const insertSeedData = require('./toolbox/insertSeedData');
const log = require('./toolbox/log');
const server = require('../server/server');

const dataSource = server.dataSources.mysqlDS;

// step 1: DROP ALL TABLES
// therefore reset the whole database to empty state
dataSource.connector.execute(`
  SHOW TABLES;
`, [], (err, results) => {
  if (err) throw err;
  
  console.log(results);

  const existingTableNames = results.map(tableData => tableData[_.keys(tableData)[0]]);
  // 'SHOW TABLES;' is just a placeholder query to prevent error.
  const dropTablesSql = existingTableNames.length === 0 ? 'SHOW TABLES;' : `
    DROP TABLE IF EXISTS ${existingTableNames.join(', ')};
  `;

  console.log(dropTablesSql);
  // drop all existing tables
  dataSource.connector.execute(dropTablesSql, [], (err) => {
    if (err) {
      console.log("what??");
      throw err;
    }

    console.log("executing!!");
    // step 2: create schema for all models
    const modelNames = getModelNames();  
    // modelNames is an array whose elements are all string

    createSchema(modelNames).then(() => {
      // step 3: insert seed data
      const seedData = getSeedData();

      insertSeedData(seedData).then(() => {
        log.success('reset-db success!');
      }).catch((err) => {
        log.error('reset-db failed.');
        log.error(err);
        process.exit(1);
      }).finally(() => {
        dataSource.disconnect();
        process.exit(0);
      });
    }).catch((err) => {
      log.error('create schema for models failed.');
      log.error(err);
      process.exit(1);
    });
  });
});
