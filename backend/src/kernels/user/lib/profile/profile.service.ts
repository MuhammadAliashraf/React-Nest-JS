import { Injectable } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

@Injectable()
export class ProfileService {
  // TODO:set values in env variable later
  private readonly s3Client = new S3Client({
    region: process.env['AWS_REGION'] || 'us-east-2',
    credentials: {
      accessKeyId: process.env['AWS_ACCESS_KEY'] || '',
      secretAccessKey:
        process.env['AWS_SECRET_ACCESS_KEY'] || '',
    },
  });

  async uploadFile(fileName: string, file: Buffer) {
    const nodeEnv = String(process.env['NODE_ENV']);
    const awsBucketName = String(process.env['AWS_BUCKET_NAME']);
    const awsRegion = String(process.env['AWS_REGION']);
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: process.env['AWS_BUCKET_NAME'],
        Key: `app/${nodeEnv}/users/${fileName}`,
        Body: file,
      }),
    );
    // const commad = new GetObjectCommand({
    //   Bucket: 'index-pos',
    //   Key: fileName,
    // });
    // const publicUrl = await getSignedUrl(this.s3Client, commad);

    const publicUrl = `https://${awsBucketName}.s3.${awsRegion}.amazonaws.com/app/${nodeEnv}/users/${fileName}`;

    return publicUrl;
  }
}
