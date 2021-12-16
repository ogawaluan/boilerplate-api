import fs from 'fs';
import path from 'path';
import Sharp from 'sharp';

import { STORAGE_DRIVER } from '../../config/env';
import { uploadsFolder } from '../../config/upload';
import { IResize } from './constants';
import { saveDiskImage, deleteDiskImage } from './diskStorage';
import { saveS3Image, deleteS3Image } from './s3Storage';

export interface IDeleteImage {
  fileName: string;
  label?: string;
  deleteGreyscale?: boolean;
}

export interface ISaveImage {
  file: Express.Multer.File;
  buffer: Buffer;
  label?: string;
  greyscaleImageBuffer?: Buffer;
}

interface IOptions {
  resizes?: IResize[];
  greyscale?: boolean;
}

const storageDriverMethods = {
  delete: {
    s3: deleteS3Image,
    disk: deleteDiskImage,
  },
  save: {
    s3: saveS3Image,
    disk: saveDiskImage,
  },
};

const deleteImage = async (
  fileName: string,
  deleteGreyscale?: boolean,
  label?: string
) => {
  const args: IDeleteImage = {
    fileName,
    label,
    deleteGreyscale,
  };

  await storageDriverMethods.delete[STORAGE_DRIVER](args);
};

const deleteResizeImages = async (
  fileName: string,
  resizes: IResize[],
  greyscale?: boolean
) => {
  await resizes.reduce(async (previousPromise, next) => {
    const previous = await previousPromise;
    const { label } = next;

    await deleteImage(fileName, greyscale, label);

    return previous;
  }, Promise.resolve());
};

export const remove = async (
  fileName: string,
  { resizes, greyscale }: IOptions = {}
): Promise<void> => {
  if (resizes) {
    await deleteResizeImages(fileName, resizes, greyscale);
  } else {
    await deleteImage(fileName, greyscale);
  }
};

const saveImage = async (
  file: Express.Multer.File,
  buffer: Buffer,
  saveGreyscale?: boolean,
  label?: string
): Promise<void> => {
  const args: ISaveImage = {
    file,
    buffer,
    label,
  };

  if (saveGreyscale) {
    const bufferGreyScaleImage = await Sharp(buffer)
      .toColorspace('b-w')
      .jpeg({ quality: 70 })
      .toBuffer();

    Object.assign(args, {
      greyscaleImageBuffer: bufferGreyScaleImage,
    });
  }

  await storageDriverMethods.save[STORAGE_DRIVER](args);
};

const saveResizeImages = async (
  file: Express.Multer.File,
  resizes: IResize[],
  saveGreyscale?: boolean
) => {
  await resizes.reduce(async (previousPromise, next) => {
    const previous = await previousPromise;
    const { label, width, height } = next;

    let filePath = file.path;

    if (STORAGE_DRIVER === 'disk') {
      filePath = path.resolve(uploadsFolder, file.filename);
    }

    const bufferImage = await Sharp(filePath)
      .rotate()
      .resize(width, height)
      .jpeg({ quality: 70 })
      .toBuffer();

    await saveImage(file, bufferImage, saveGreyscale, label);

    return previous;
  }, Promise.resolve());

  await deleteDiskImage({ fileName: file.filename });
};

export const save = async (
  file: Express.Multer.File,
  { resizes, greyscale }: IOptions = {}
): Promise<void> => {
  if (resizes) {
    await saveResizeImages(file, resizes, greyscale);
  } else if (STORAGE_DRIVER !== 'disk') {
    const fileContent = await fs.promises.readFile(file.path);

    await saveImage(file, fileContent, greyscale);
    await deleteDiskImage({ fileName: file.filename });
  }
};
