import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

// Create S3 client instance
const createS3Client = () => {
  return new S3Client({
    region: process.env.AWS_REGION ?? 'us-east-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });
};

// S3 upload helper
export const uploadToS3 = async (
  file: Express.Multer.File,
  folder = 'reports'
): Promise<string> => {
  const s3Client = createS3Client();
  const bucketName = process.env.AWS_S3_BUCKET_NAME;

  if (!bucketName) {
    throw new Error('AWS S3 bucket name is not configured');
  }

  const key = `${folder}/${Date.now().toString()}-${file.originalname?.toLowerCase()?.replace(/ /g, '-')}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  try {
    await s3Client.send(command);
    // Construct the URL manually since PutObjectCommand doesn't return Location
    const region = process.env.AWS_REGION ?? 'us-east-1';
    return `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
  } catch (error) {
    console.error('S3 upload error:', error);
    throw new Error('Failed to upload file to S3');
  }
};

// S3 delete helper
export const deleteFromS3 = async (fileUrl: string): Promise<void> => {
  const s3Client = createS3Client();
  const bucketName = process.env.AWS_S3_BUCKET_NAME;

  if (!bucketName) {
    throw new Error('AWS S3 bucket name is not configured');
  }

  // Extract key from URL
  const url = new URL(fileUrl);
  const key = url.pathname.substring(1); // Remove leading slash

  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  try {
    await s3Client.send(command);
  } catch (error) {
    console.error('S3 delete error:', error);
    throw new Error('Failed to delete file from S3');
  }
};

export { createS3Client }; 