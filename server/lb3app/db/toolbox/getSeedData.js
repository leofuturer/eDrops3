/**
 * read seed data from /db/seed-data/ if it matches the model name
 * returns an object that works like:
 * {
 *   User: require('../seed-data/users.json')
 */

const path = require('path');
const fs = require('fs-extra');
const getModelNames = require('./getModelNames');

const modelNames = getModelNames();

module.exports = () => {
  const seedData = {};

  modelNames.forEach((modelName) => {
    let seedDataExists = true;
    let data;

    try {
      data = fs.readJsonSync(path.resolve(__dirname, `../seed-data/${modelName}.json`));
    } catch (e) {
      seedDataExists = false;
    }

    if (seedDataExists) {
      seedData[modelName] = data;
    }
  });

  return seedData;
};
