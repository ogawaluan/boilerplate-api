import { IncomingHttpHeaders } from 'http';

import { LanguagesConstants } from './constants';

class UserLanguage {
  private static language = LanguagesConstants.ENGLISH;

  static getLanguage = (): LanguagesConstants => {
    return UserLanguage.language;
  };

  static setLanguage = (headers: IncomingHttpHeaders): void => {
    const language = headers['content-language'] as LanguagesConstants;

    if (Object.values(LanguagesConstants).includes(language)) {
      UserLanguage.language = language;
      return;
    }

    UserLanguage.language = LanguagesConstants.ENGLISH;
  };
}

export default UserLanguage;
