import {juggler} from '@loopback/repository';
import {MysqlDsDataSource} from './datasources/mysql-ds.datasource';

async function migrate() {
  const ds = new MysqlDsDataSource();

  try {
    // Log datasource settings
    console.log('Datasource settings:', ds.settings);

    // Perform the schema migration for the datasource
    console.log('Migrating database schema...');
    await ds.automigrate();
    console.log('Database migration completed.');

  } catch (err) {
    console.error('Cannot migrate database schema', err);
  } finally {
    // Disconnect the datasource
    await ds.disconnect();
    console.log('Datasource disconnected.');
    process.exit(0);
  }
}

migrate().catch(err => {
  console.error('Cannot migrate database schema', err);
  process.exit(1);
});