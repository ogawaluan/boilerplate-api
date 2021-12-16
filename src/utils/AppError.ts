import { UserLanguage } from '.';
import { appErrorMessages, AppErrorType } from './translations';

interface IRequest {
  type: AppErrorType;
  templateVariables?: Record<string, any>;
  statusCode?: number;
}

class AppError {
  public readonly message: string;

  public readonly statusCode: number;

  constructor({ type, statusCode = 400, templateVariables = {} }: IRequest) {
    const userLanguage = UserLanguage.getLanguage();
    const stringsToReplace = Object.values(templateVariables);

    this.message = appErrorMessages[userLanguage][type];
    this.statusCode = statusCode;

    if (stringsToReplace.length > 0) {
      let errorMessage = this.message;

      stringsToReplace.forEach((errorVariable, index) => {
        const errorKey = Object.keys(templateVariables)[index];
        errorMessage = errorMessage.replace(errorKey, errorVariable);
      });

      this.message = errorMessage;
    }
  }
}

export default AppError;
