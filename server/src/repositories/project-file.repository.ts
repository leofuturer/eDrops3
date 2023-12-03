import { Getter, inject } from '@loopback/core';
import {
  BelongsToAccessor, DefaultCrudRepository,
  repository
} from '@loopback/repository';
import { HttpErrors, Request, Response } from '@loopback/rest';
import AWS from 'aws-sdk';
import path from 'path';
import { MysqlDsDataSource } from '../datasources';
import { calculate } from '../lib/toolbox/calculate';
import { Project, ProjectFile, ProjectFileRelations } from '../models';
import { STORAGE_DIRECTORY } from '../services';
import { ProjectRepository } from './project.repository';

const CONTAINER_NAME = process.env.S3_BUCKET_NAME ?? 'edroplets-files';

export class ProjectFileRepository extends DefaultCrudRepository<
  ProjectFile,
  typeof ProjectFile.prototype.id,
  ProjectFileRelations
> {
  public readonly s3: AWS.S3;

  public readonly project: BelongsToAccessor<
    Project,
    typeof ProjectFile.prototype.id
  >;

  constructor(
    @inject('datasources.mysqlDS') dataSource: MysqlDsDataSource,
    @inject(STORAGE_DIRECTORY) private storageDirectory: string,
    @repository.getter('ProjectRepository')
    protected projectRepositoryGetter: Getter<ProjectRepository>,
  ) {
    super(ProjectFile, dataSource);
    this.project = this.createBelongsToAccessorFor(
      'project',
      projectRepositoryGetter,
    );
    this.registerInclusionResolver('project', this.project.inclusionResolver);

    if (process.env.NODE_ENV === 'production') {
      AWS.config.update({
        accessKeyId: process.env.S3_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        region: process.env.S3_AWS_DEFAULT_REGION,
      });

      this.s3 = new AWS.S3();
    }
  }

  async uploadFileDisk(
    request: Request,
    response: Response,
    username: string,
    userId: string,
    fileType: "attachment" | "image" = "attachment",
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
          containerFileName: `community/${f.originalname}`,
          container: CONTAINER_NAME, // need fix
          isDeleted: false,
          isPublic: request.body.isPublic === 'public',
          fileType: fileType,
          fileSize: calculate.formatBytes(f.size as number, 1),
          uploader: username,
          userId: userId,
        };
      },
    );

    const fields = request.body;
    const fileInfo: Partial<ProjectFile>[] = await this.createAll(projectFiles);
    return {fileInfo, fields};
  }

  async uploadFileS3(
    request: Request,
    response: Response,
    username: string,
    userId: string,
    fileType: "attachment" | "image" = "attachment",
  ): Promise<object> {
    const mapper = (f: Express.MulterS3.File) => ({
      fieldname: f.fieldname,
      originalname: f.originalname,
      mimetype: f.mimetype,
      size: f.size,
      key: f.key,
      metadata: f.metadata,
    });
    // Parse multipart/form-data file info from request
    let files: Partial<Express.MulterS3.File>[] = [];

    const uploadedFiles = request.files;
    if (Array.isArray(uploadedFiles)) {
      /* @ts-ignore */
      files = uploadedFiles.map(mapper);
    } else {
      for (const filename in uploadedFiles) {
        /* @ts-ignore */
        files.push(...uploadedFiles[filename].map(mapper));
      }
    }

    const fileInfos: Partial<ProjectFile>[] = files.map(
      (f: Partial<Express.MulterS3.File>) => {
        return {
          uploadTime: calculate.currentTime(),
          fileName: request.body.newName
            ? request.body.newName
            : f.originalname,
          containerFileName: f.key,
          container: CONTAINER_NAME, // need fix
          isDeleted: false,
          isPublic: request.body.isPublic === 'public',
          fileType: fileType,
          fileSize: calculate.formatBytes(f.size as number, 1),
          uploader: username,
          userId: userId,
        };
      },
    );

    const fields = request.body;
    const fileInfo: Partial<ProjectFile>[] = await this.createAll(fileInfos);
    // return {files, fields};
    return {fileInfo, fields};
  }

  async downloadFileDisk(
    filename: string,
    response: Response,
  ): Promise<Response> {
    const file = path.resolve(`${this.storageDirectory}/`, filename);
    if (!file.startsWith(this.storageDirectory))
      throw new HttpErrors.BadRequest(`Invalid file id: ${filename}`);
    response.download(file, filename);
    return response;
  }

  async downloadFileS3(
    filename: string,
    response: Response,
  ): Promise<Response> {
    const file = await this.s3
      .getObject({
        Key: filename,
        Bucket: CONTAINER_NAME,
      })
      .promise();
    // console.log(file);

    response.writeHead(200, {
      'Content-Type': file.ContentType,
      'Content-Disposition': file.ContentDisposition,
    });
    response.end(file.Body);
    return response;
  }
}
