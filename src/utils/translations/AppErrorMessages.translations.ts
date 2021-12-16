import { LanguagesConstants } from '../constants';

enum AppErrorType {
  UNAUTHORIZED_ROUTE_ACCESS = 'UNAUTHORIZED_ROUTE_ACCESS',
  MISSING_TOKEN = 'MISSING_TOKEN',
  INVALID_TOKEN = 'INVALID_TOKEN',
  TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS',
  APPLE_ID_NOT_FOUND = 'APPLE_ID_NOT_FOUND',
  WRONG_EMAIL_PASSWORD = 'WRONG_EMAIL_PASSWORD',
  CANT_DELETE_ADMIN_USER = 'CANT_DELETE_ADMIN_USER',
  /** Replace `{extname}` with the desired extension name */
  UNSUPPORTED_FILE_TYPE = 'UNSUPPORTED_FILE_TYPE',
}

type AppErrorMessages = {
  [language in LanguagesConstants]: {
    [error in AppErrorType]: string;
  };
};

const appErrorMessages: AppErrorMessages = {
  [LanguagesConstants.ENGLISH]: {
    UNAUTHORIZED_ROUTE_ACCESS: `You don't have access to this route`,
    MISSING_TOKEN: 'Token is missing',
    INVALID_TOKEN: 'Invalid token',
    TOO_MANY_REQUESTS: 'Too many requests',
    APPLE_ID_NOT_FOUND: 'Apple ID not found',
    WRONG_EMAIL_PASSWORD: 'Incorrect email/password combination',
    CANT_DELETE_ADMIN_USER: `You can't delete an administrator user`,
    UNSUPPORTED_FILE_TYPE: 'Unsupported file type: {extname}',
  },
  [LanguagesConstants.PORTUGUESE]: {
    UNAUTHORIZED_ROUTE_ACCESS: 'Você não possui acesso a esta rota',
    MISSING_TOKEN: 'Token ausente',
    INVALID_TOKEN: 'Token inválido',
    TOO_MANY_REQUESTS: 'Requisições em excesso',
    APPLE_ID_NOT_FOUND: 'Apple ID não encontrado',
    WRONG_EMAIL_PASSWORD: 'E-mail/Senha incorretos',
    CANT_DELETE_ADMIN_USER: 'Você não pode deletar um usuário administrador',
    UNSUPPORTED_FILE_TYPE: 'Tipo de arquivo não suportado: {extname}',
  },
};

export { AppErrorType, appErrorMessages };
