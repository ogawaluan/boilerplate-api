import path from 'path';
import { getRepository } from 'typeorm';

import { MAIL_DRIVER } from '../../config/env';
import { mailHelper } from '../../helpers';
import { User } from '../../models';

class SendForgotPasswordService {
  static execute = async (email: string): Promise<void> => {
    const usersRepo = getRepository(User);

    const user = await usersRepo.findOneOrFail({
      where: { email },
    });

    user.temporaryPassword = Math.random().toString(36).slice(-8);

    const forgotPasswordTemplate = path.resolve(
      __dirname,
      '..',
      '..',
      'views',
      'mail-templates',
      'forgot_password_views.hbs'
    );

    if (MAIL_DRIVER === 'ethereal') {
      await mailHelper.sendMailEthereal({
        to: {
          name: user.name || 'Nome não identificado',
          email: user.email || 'E-mail não identificado',
        },
        subject: '[BoilerplateAPI] Recuperação de Senha',
        templateData: {
          file: forgotPasswordTemplate,
          variables: {
            name: user.name,
            temporaryPassword: user.temporaryPassword,
          },
        },
      });
    }

    await usersRepo.save(user);
  };
}

export default SendForgotPasswordService;
