import aws from 'aws-sdk';

import { ISaveImage, IDeleteImage } from '.';
import { awsConfig } from '../../config/upload';

interface IKeys {
  key: string;
  greyscaleKey?: string;
}

const client = new aws.S3();

const generateKeys = (
  fileName: string,
  generateGreyscale?: boolean,
  label?: string
): IKeys => {
  const keys = {
    key: label ? `${label}-${fileName}` : `${fileName}`,
  };

  if (generateGreyscale) {
    Object.assign(keys, {
      greyscaleKey: label ? `${label}-g-${fileName}` : `g-${fileName}`,
    });
  }

  return keys;
};

export const saveS3Image = async ({
  file,
  buffer,
  label,
  greyscaleImageBuffer,
}: ISaveImage): Promise<void> => {
  const commonProps = {
    ...awsConfig,
    ContentType: file.mimetype,
  };

  const { key, greyscaleKey } = generateKeys(
    file.filename,
    !!greyscaleImageBuffer,
    label
  );

  await client
    .putObject({
      ...commonProps,
      Key: key,
      Body: buffer,
    })
    .promise();

  if (greyscaleKey) {
    await client
      .putObject({
        ...commonProps,
        Key: greyscaleKey,
        Body: greyscaleImageBuffer,
      })
      .promise();
  }
};

export const deleteS3Image = async ({
  fileName,
  deleteGreyscale,
  label,
}: IDeleteImage): Promise<void> => {
  const { key, greyscaleKey } = generateKeys(fileName, deleteGreyscale, label);

  await client
    .deleteObject({
      Key: key,
      Bucket: awsConfig.Bucket,
    })
    .promise();

  if (greyscaleKey) {
    await client
      .deleteObject({ Key: greyscaleKey, Bucket: awsConfig.Bucket })
      .promise();
  }
};
