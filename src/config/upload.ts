import multer, { Options } from 'multer';
import path, { extname } from 'path';

import { AppError } from '../utils';
import { AppErrorType } from '../utils/translations';
import { AWS_BUCKET } from './env';

const uploadsFolder = path.resolve(__dirname, '..', '..', 'uploads');

const multerConfig: Options = {
  storage: multer.diskStorage({
    destination: uploadsFolder,
    filename(_, file, callback) {
      const fileName = `${Date.now()}${extname(file.originalname)}`;

      return callback(null, fileName);
    },
  }),
  fileFilter(_, file, cb: any) {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(
        new AppError({
          type: AppErrorType.UNSUPPORTED_FILE_TYPE,
          statusCode: 415,
          templateVariables: {
            '{extname}': extname(file.originalname),
          },
        }),
        false
      );
    }
  },
};

const awsConfig = {
  Bucket: AWS_BUCKET as string,
  ACL: 'public-read',
};

export { uploadsFolder, multerConfig, awsConfig };
