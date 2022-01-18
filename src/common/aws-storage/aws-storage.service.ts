import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { environment } from '../../environments/environment';
import * as AWS from 'aws-sdk';
import { AWSError, S3 } from 'aws-sdk';
import * as stream from 'stream';
import { Readable } from 'stream';
import { lstatSync, readdirSync, readFileSync } from 'fs';
import { ConfigService } from '@nestjs/config';
import { PromiseResult } from 'aws-sdk/lib/request';
import * as path from 'path';

export enum EXPIRATION_TIME {
  ONE_MINUTES = 60,
  FIVE_MINUTES = 300,
  TEN_MINUTES = 600,
}

@Injectable()
export class AwsStorageService {
  s3: AWS.S3;
  bucket: string;
  private defaultOptions = {
    Bucket: environment.aws.s3.bucket,
  };

  constructor(private configService: ConfigService) {
    const configuredBucket = this.configService.get<string>('S3_FILES_BUCKET');

    if (!configuredBucket) {
      throw new InternalServerErrorException('Storage bucket error');
    }

    this.bucket = configuredBucket;

    this.s3 = new AWS.S3({
      endpoint: environment.aws.endpoint,
      region: environment.aws.region,
      signatureVersion: 'v4'
    });
  }

  async listObjectsV2(path: string): Promise<PromiseResult<S3.ListObjectsV2Output, AWSError>> {
    console.log('listObjectsV2', path);
    return this.s3.listObjectsV2({
      Bucket: this.bucket,
      Prefix: path
    }).promise();
  }

  get(objectKey: string): stream.Readable {
    return this.s3.getObject({ Bucket: this.bucket, Key: objectKey }).createReadStream();
  }

  async save(objectKey: string, buffer: Buffer | Uint8Array | Blob | string | Readable): Promise<void> {
    console.log(`Uploading ${objectKey}`);
    await this.s3.upload({
      Bucket: this.bucket,
      Key: objectKey,
      Body: buffer
    }).promise();
  }

  async delete(objectKey: string): Promise<void> {
    await this.s3.deleteObject({ Bucket: this.bucket, Key: objectKey }).promise();
  }

  async deleteRecursive(path: string): Promise<void> {
    // Delete all files in folder
    const request = await this.listObjectsV2(path);
    if (request.Contents) {
      for (const s3Object of request.Contents) {
        if (s3Object.Key && s3Object.Key != path) {
          await this.delete(s3Object.Key);
        }
      }
    }

    // Now delete the folder
    await this.delete(path);
  }

  getSignedUrl(operation: string, params: Record<string, unknown>): string {
    return this.s3.getSignedUrl(operation, { ...this.defaultOptions, ...params });
  }

  async copyRecursive(destinationDirectory: string, sourceDirectory: string): Promise<void> {
    console.log(`Recursive copy source=${sourceDirectory} destination=${destinationDirectory}`);
    const files = readdirSync(sourceDirectory);
    for (const file of files) {
      const sourceFileAbsolutePath = path.join(sourceDirectory, file);
      const destinationFileAbsolutePath = path.join(destinationDirectory, file);
      console.log(`Processing file ${sourceFileAbsolutePath}`);
      if (lstatSync(sourceFileAbsolutePath).isFile()) {
        await this.save(destinationFileAbsolutePath,
          readFileSync(sourceFileAbsolutePath));
      }
    }
  }

  async copyRecursiveS3(sourcePath: string, destinationPath: string): Promise<void> {
    const request = await this.listObjectsV2(sourcePath);
    if (request.Contents) {
      for (const s3Object of request.Contents) {
        if (s3Object.Key && s3Object.Key != sourcePath) {
          const newObjectKey = s3Object.Key.replace(sourcePath, destinationPath);
          console.log(`Copy ${s3Object.Key} to ${newObjectKey}`);
          const result = await this.s3.copyObject({
            Bucket: this.bucket,
            CopySource: `/${this.bucket}/${s3Object.Key}`,
            Key: `${newObjectKey}`
          }).promise();
          console.log(result);
        }
      }
    }
  }
}
