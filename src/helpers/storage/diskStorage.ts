import fs from 'fs';
import path from 'path';

import { ISaveImage, IDeleteImage } from '.';
import { uploadsFolder } from '../../config/upload';

interface IPaths {
  filePath: string;
  greyscalePath: string;
}

const getFilePaths = (fileName: string, label?: string): IPaths => {
  const fileFullName = label ? `${label}-${fileName}` : fileName;
  const greyscaleFullName = label ? `${label}-g-${fileName}` : `g-${fileName}`;

  return {
    filePath: path.resolve(uploadsFolder, fileFullName),
    greyscalePath: path.resolve(uploadsFolder, greyscaleFullName),
  };
};

export const saveDiskImage = async ({
  file,
  buffer,
  label,
  greyscaleImageBuffer,
}: ISaveImage): Promise<void> => {
  const { filePath, greyscalePath } = getFilePaths(file.filename, label);

  await fs.promises.writeFile(filePath, buffer);

  if (greyscaleImageBuffer) {
    await fs.promises.writeFile(greyscalePath, greyscaleImageBuffer);
  }
};

const tryToDeleteFile = (filePath?: string) => {
  if (!filePath) return;

  fs.stat(filePath, async err => {
    if (!err) await fs.promises.unlink(filePath);
  });
};

export const deleteDiskImage = async ({
  fileName,
  label,
}: IDeleteImage): Promise<void> => {
  const { filePath, greyscalePath } = getFilePaths(fileName, label);

  tryToDeleteFile(filePath);
  tryToDeleteFile(greyscalePath);
};
