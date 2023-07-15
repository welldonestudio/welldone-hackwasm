import { config, S3 } from 'aws-sdk';

config.update({
  region: 'us-east-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY || '',
    secretAccessKey: process.env.AWS_SECRET_KEY || '',
  },
});

export class S3Service {
  async downloadUrl(
    bucket: string,
    fileKey: string,
  ): Promise<string | undefined> {
    const s3 = new S3({ region: 'us-east-2', signatureVersion: 'v4' });
    const params = {
      Bucket: bucket,
      Expires: 3000,
      Key: fileKey,
    };
    return await s3.getSignedUrlPromise('getObject', params).catch((err) => {
      console.error(err);
      return '';
    });
  }
}
