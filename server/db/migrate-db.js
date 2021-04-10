/**
 * At the very start of development work, use this function to create schemas from all models.
 * Or when we alter certain properties of models, we can use this to update schemas of database
 *
 * NOTES:
 *   You will need MySQL root privilege to execute this scripts.
 */

const getModelNames = require('./toolbox/getModelNames');
const updateSchema = require('./toolbox/updateSchema');
const log = require('./toolbox/log');
const server = require('../server/server');

const dataSource = server.dataSources.mysqlDS;
const modelNames = getModelNames();

updateSchema(modelNames).then(() => {
  log.success('migrate-db success!');
  dataSource.disconnect();
  process.exit(0);
}).catch((err) => {
  log.error('migrate-db failed.');
  log.error(err);
  process.exit(1);
});
