import { inject } from '@loopback/core';
import { DefaultCrudRepository } from '@loopback/repository';
import { HttpErrors, Response } from '@loopback/rest';
import path from 'path';
import { MysqlDsDataSource } from '../datasources';
import { FileInfo, FileInfoRelations } from '../models';
import { STORAGE_DIRECTORY } from '../services';

const CONTAINER_NAME = process.env.S3_BUCKET_NAME ?? 'edrop-v2-files';

export class FileInfoRepository extends DefaultCrudRepository<
  FileInfo,
  typeof FileInfo.prototype.id,
  FileInfoRelations
> {

  public readonly s3: AWS.S3;

  constructor(
    @inject('datasources.mysqlDS') dataSource: MysqlDsDataSource,
    @inject(STORAGE_DIRECTORY) private storageDirectory: string,
  ) {
    super(FileInfo, dataSource);
  }

  async downloadById(fileId: typeof FileInfo.prototype.id, response: Response): Promise<Response> {
    const file = await this.findById(fileId);
    if (!file) throw new HttpErrors.NotFound(`File not found: ${fileId}`);
    return process.env.NODE_ENV !== 'production'
      ? this.downloadDisk(file.containerFileName, response)
      : this.downloadS3(file.containerFileName, response);
  }

  async downloadDisk(filename: string, response: Response): Promise<Response> {
    const file = path.resolve(`${this.storageDirectory}/`, filename);
    if (!file.startsWith(this.storageDirectory))
      throw new HttpErrors.BadRequest(`Invalid file id: ${filename}`);
    response.download(file, filename);
    return response;
  }

  async downloadS3(filename: string, response: Response): Promise<Response> {
    const file = await this.s3
      .getObject({
        Key: filename,
        Bucket: CONTAINER_NAME,
      })
      .promise();

    response.writeHead(200, {
      'Content-Type': file.ContentType,
      'Content-Disposition': file.ContentDisposition,
    });
    response.end(file.Body);
    return response;
  }
}
