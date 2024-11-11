'use strict';

module.exports = function(app) {
  var db = app.datasources.mysqlDS;

  db.autoupdate(function(err) {
    if (err) throw err;
    console.log('\nAutomigrate completed');
    // other code here
  });
};