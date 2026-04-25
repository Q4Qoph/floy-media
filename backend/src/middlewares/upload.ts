import multer from 'multer';
import { AppError } from '../utils/AppError';

const imageMime = ['image/jpeg', 'image/png', 'image/webp'];
const videoMime = ['video/mp4', 'video/quicktime', 'video/webm'];

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if ([...imageMime, ...videoMime].includes(file.mimetype)) {
      return cb(null, true);
    }
    return cb(new AppError('Unsupported file type', 400, {}));
  }
});

export const thumbnailUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (imageMime.includes(file.mimetype)) return cb(null, true);
    return cb(new AppError('Invalid thumbnail type', 400, {}));
  }
});
