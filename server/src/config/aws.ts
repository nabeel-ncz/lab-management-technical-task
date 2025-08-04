import AWS from 'aws-sdk';

// Configure AWS
const configureAWS = () => {
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION ?? 'us-east-1',
  });
};

// Create S3 instance
const createS3Instance = () => {
  configureAWS();
  return new AWS.S3();
};

// S3 upload helper
export const uploadToS3 = async (
  file: Express.Multer.File,
  folder = 'reports'
): Promise<string> => {
  const s3 = createS3Instance();
  const bucketName = process.env.AWS_S3_BUCKET_NAME;

  if (!bucketName) {
    throw new Error('AWS S3 bucket name is not configured');
  }

  const key = `${folder}/${Date.now().toString()}-${file.originalname?.toLowerCase()?.replace(/ /g, '-')}`;

  const params = {
    Bucket: bucketName,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read',
  };

  try {
    const result = await s3.upload(params).promise();
    return result.Location;
  } catch (error) {
    console.error('S3 upload error:', error);
    throw new Error('Failed to upload file to S3');
  }
};

// S3 delete helper
export const deleteFromS3 = async (fileUrl: string): Promise<void> => {
  const s3 = createS3Instance();
  const bucketName = process.env.AWS_S3_BUCKET_NAME;

  if (!bucketName) {
    throw new Error('AWS S3 bucket name is not configured');
  }

  // Extract key from URL
  const url = new URL(fileUrl);
  const key = url.pathname.substring(1); // Remove leading slash

  const params = {
    Bucket: bucketName,
    Key: key,
  };

  try {
    await s3.deleteObject(params).promise();
  } catch (error) {
    console.error('S3 delete error:', error);
    throw new Error('Failed to delete file from S3');
  }
};

export { configureAWS, createS3Instance }; 