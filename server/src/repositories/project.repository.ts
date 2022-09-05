import {inject, Getter} from '@loopback/core';
import {
  DefaultCrudRepository,
  repository,
  HasManyRepositoryFactory,
} from '@loopback/repository';
import {Request, Response} from '@loopback/rest';
import {MysqlDsDataSource} from '../datasources';
import {calculate} from '../lib/toolbox/calculate';
import {Project, ProjectRelations, ProjectFile} from '../models';
import {ProjectFileRepository} from './project-file.repository';

const CONTAINER_NAME = process.env.S3_BUCKET_NAME ?? 'edrop-v2-files';

export class ProjectRepository extends DefaultCrudRepository<
  Project,
  typeof Project.prototype.id,
  ProjectRelations
> {
  public readonly projectFiles: HasManyRepositoryFactory<
    ProjectFile,
    typeof Project.prototype.id
  >;

  constructor(
    @inject('datasources.mysqlDS') dataSource: MysqlDsDataSource,
    @repository.getter('ProjectFileRepository')
    protected projectFileRepositoryGetter: Getter<ProjectFileRepository>,
  ) {
    super(Project, dataSource);
    this.projectFiles = this.createHasManyRepositoryFactoryFor(
      'projectFiles',
      projectFileRepositoryGetter,
    );
    this.registerInclusionResolver(
      'projectFiles',
      this.projectFiles.inclusionResolver,
    );
  }

  async getFeaturedProjects(): Promise<Project[]> {
    return this.find({
      where: {
        datetime: {
          gte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
        },
      },
      order: ['likes DESC'],
      limit: 4,
    });
  }

  async uploadFileDisk(
    request: Request,
    response: Response,
    projectId: number,
  ): Promise<object> {
    const mapper = (f: Express.Multer.File) => ({
      fieldname: f.fieldname,
      originalname: f.originalname,
      mimetype: f.mimetype,
      size: f.size,
      filename: f.filename,
    });
    // Parse multipart/form-data file info from request
    let files: Partial<Express.Multer.File>[] = [];
    const uploadedFiles = request.files;
    // Normalize uploaded files into an array
    if (Array.isArray(uploadedFiles)) {
      files = uploadedFiles.map(mapper);
    } else {
      for (const filename in uploadedFiles) {
        files.push(...uploadedFiles[filename].map(mapper));
      }
    }

    const projectFiles: Partial<ProjectFile>[] = files.map(
      (f: Partial<Express.Multer.File>) => {
        return {
          uploadTime: calculate.currentTime(),
          fileName: request.body.newName
            ? request.body.newName
            : f.originalname,
          containerFileName: f.originalname,
          container: CONTAINER_NAME, // need fix
          isDeleted: false,
          isPublic: request.body.isPublic === 'public',
          fileType: 'dxf',
          fileSize: calculate.formatBytes(f.size as number, 1),
        };
      },
    );

    const fields = request.body;
    const fileInfo = await this.projectFiles(projectId).create(projectFiles[0]);
    // return {files, fields};
    return {fileInfo, fields};
  }

  async uploadFileS3(
    request: Request,
    response: Response,
  ): Promise<object> {
    return {};
  }
}
