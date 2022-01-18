import { config } from 'dotenv';

config();

export const environment = {
  name: process.env.ENVIRONMENT || 'development',
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/tycho-db',
  aws: {
    endpoint: process.env.AWS_ENDPOINT_URL,
    region: 'eu-central-1',
    s3: {
      bucket: process.env.S3_FILES_BUCKET
    }
  },
  AWS_ACCESS_KEY_ID: 'test',
  AWS_SECRET_ACCESS_KEY: 'test',
};
