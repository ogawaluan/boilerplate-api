/* eslint-disable import/prefer-default-export */
import fs from 'fs';
import handlebars from 'handlebars';

import { IParseMailTemplate } from './interfaces';

const handlebarsParse = async ({
  file,
  variables,
}: IParseMailTemplate): Promise<string> => {
  const templateFileContent = await fs.promises.readFile(file, {
    encoding: 'utf-8',
  });

  const parseTemplate = handlebars.compile(templateFileContent);

  return parseTemplate(variables);
};

export { handlebarsParse };
