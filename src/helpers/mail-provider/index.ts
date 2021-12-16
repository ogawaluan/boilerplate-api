/* eslint-disable import/prefer-default-export */
/* eslint-disable no-console */
import {
  createTestAccount,
  createTransport,
  getTestMessageUrl,
} from 'nodemailer';

import { handlebarsParse } from './HandlebarsParseTemplate';
import { IParseMailTemplate } from './interfaces';

interface IMailContact {
  name: string;
  email: string;
}

interface ISendMail {
  to: IMailContact;
  from?: IMailContact;
  subject: string;
  templateData: IParseMailTemplate;
}

const sendMailEthereal = async ({
  to,
  from,
  subject,
  templateData,
}: ISendMail): Promise<void> => {
  const { smtp, user, pass } = await createTestAccount();

  const transporter = createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: { user, pass },
  });

  const message = await transporter.sendMail({
    from: {
      name: 'Equipe Hox.rs',
      address: from?.email || 'equipe@hox.rs',
    },
    to: {
      name: to.name,
      address: to.email,
    },
    subject,
    html: await handlebarsParse(templateData),
  });

  console.log(`Preview URL: ${getTestMessageUrl(message)}`);
};

export { sendMailEthereal };
