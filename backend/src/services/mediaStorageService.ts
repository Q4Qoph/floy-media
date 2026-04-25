import { BlobServiceClient } from '@azure/storage-blob';
import { AppError } from '../utils/AppError';

type UploadKind = 'images' | 'videos' | 'thumbnails';

const sanitizeName = (name: string) =>
  name.replace(/[^a-zA-Z0-9._-]/g, '-').replace(/-{2,}/g, '-');

const getKindFromMime = (mimeType: string): UploadKind => {
  if (mimeType.startsWith('image/')) return 'images';
  if (mimeType.startsWith('video/')) return 'videos';
  return 'images';
};

const saveToAzureBlob = async (file: Express.Multer.File, kindOverride?: UploadKind) => {
  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
  const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;
  if (!connectionString || !containerName) {
    throw new AppError('Azure storage is not configured', 500, {
      required: ['AZURE_STORAGE_CONNECTION_STRING', 'AZURE_STORAGE_CONTAINER_NAME']
    });
  }

  const blobService = BlobServiceClient.fromConnectionString(connectionString);
  const container = blobService.getContainerClient(containerName);
  await container.createIfNotExists();

  const kind = kindOverride ?? getKindFromMime(file.mimetype);
  const blobName = `${kind}/${Date.now()}-${Math.round(Math.random() * 1e9)}-${sanitizeName(file.originalname)}`;
  const blobClient = container.getBlockBlobClient(blobName);

  await blobClient.uploadData(file.buffer, {
    blobHTTPHeaders: {
      blobContentType: file.mimetype
    }
  });

  return {
    storage: 'azure',
    filename: blobName.split('/').pop() || blobName,
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
    url: blobClient.url
  };
};

export const uploadMediaFile = async (file: Express.Multer.File, kindOverride?: UploadKind) => {
  return saveToAzureBlob(file, kindOverride);
};
