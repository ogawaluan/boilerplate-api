import { PORT, STORAGE_DRIVER } from '../config/env';
import { awsConfig } from '../config/upload';
import { IResize } from '../helpers/storage/constants';

const getUrlImages = <T>(resizes: IResize[], image?: string): T | null => {
  if (!image) return null;

  const baseUrls = {
    s3: `https://${awsConfig.Bucket}.s3.amazonaws.com/`,
    disk: `http://localhost:${PORT}/files/`,
  };

  return resizes.reduce((acc, { label }) => {
    const urlBuilder = `${baseUrls[STORAGE_DRIVER]}${label}-${image}`;
    const [, labelWithouPrefix] = label.split('-');

    return {
      ...acc,
      [labelWithouPrefix]: urlBuilder,
    };
  }, {}) as T;
};

export default getUrlImages;
