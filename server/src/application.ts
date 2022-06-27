import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin, SchemaMigrationOptions} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {MySequence} from './sequence';
import {Lb3AppBooterComponent} from '@loopback/booter-lb3app';
import {clearDb, seedDb} from './lib/seed';

export {ApplicationConfig};

export class EdropsBackendApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  seedDb: (this: any) => Promise<void>;
  clearDb: (this: any) => Promise<void>;
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    if (process.env.NODE_ENV != 'production') {
      this.configure(RestExplorerBindings.COMPONENT).to({
        path: '/explorer',
      });
      this.component(RestExplorerComponent);
    }

    // Loopback 3 booter component
    // this.component(Lb3AppBooterComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }

  async migrateSchema(options?: SchemaMigrationOptions) {
    // Run default migraiton scripts
    if (process.env.MIGRATE_DATABASE == 'Yes') {
      console.log('Migrating schema...');
      // console.log('Options:', options);
      await super.migrateSchema(options);
      // console.log('Schema migration complete');
    }

    // Seed database if environmental variable is set
    if (
      process.env.RESET_DATABASE == 'Yes' &&
      process.env.NODE_ENV != 'production'
    ) {
      console.log('Clearing database...');
      this.clearDb = clearDb.bind(this);
      await this.clearDb()
        .then(() => {
          console.log('Seeding database...');
          this.seedDb = seedDb.bind(this);
          this.seedDb();
        })
        .catch(err => {
          console.log('Error seeding database:', err);
        });
    }
  }
}
