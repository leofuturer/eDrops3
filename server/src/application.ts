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
import { ForumRepository, ProjectRepository } from './repositories';

export {ApplicationConfig};

export class EdropsBackendApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    // Loopback 3 booter component
    this.component(Lb3AppBooterComponent);

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
    // 1. Run migration scripts provided by connectors
    await super.migrateSchema(options);

    // 2. Make further changes. When creating predefined model instances,
    // handle the case when these instances already exist.
    const forumRepo = await this.getRepository(ForumRepository);
    for(let i = 0; i < 10; i++) {
      await forumRepo.create(createForum());
    }        

    const projectRepo = await this.getRepository(ProjectRepository);
    for(let i = 0; i < 10; i++) {
      await projectRepo.create(createProject());
    }
  }
}

import {Project, Forum} from './models';
import {faker} from '@faker-js/faker';

function createProject(): Project {
  return {
    author: faker.name.findName(),
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraphs(),
    datetime: faker.date.past().toISOString(),
    likes: Math.random() * 100,
  } as Project;
}

function createForum(): Forum {
  return {
    parentId: 0,
    author: faker.name.findName(),
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraphs(),
    datetime: faker.date.past().toISOString(),
    likes: Math.random() * 100,
  } as Forum;
}