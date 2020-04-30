import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

const tempFolder = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  directory: tempFolder,

  storage: multer.diskStorage({
    destination: tempFolder,
    filename(request, file, callBack) {
      const fileHash = crypto.randomBytes(10).toString('Hex');
      const fileName = `${fileHash}-${file.originalname}`;

      return callBack(null, fileName);
    },
  }),
};
