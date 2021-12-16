import { ValidationErrorItem } from 'joi';

import { LanguagesConstants } from '../constants';
import UserLanguage from '../UserLanguage';

enum JoiValidationErrorType {
  'string.base' = 'string.base',
  'string.email' = 'string.email',
  'string.min' = 'string.min',
  'string.guid' = 'string.guid',
  'string.empty' = 'string.empty',
  'number.base' = 'number.base',
  'number.min' = 'number.min',
  'number.max' = 'number.max',
  'boolean.base' = 'boolean.base',
  'any.only' = 'any.only',
  'any.required' = 'any.required',
  'object.unknown' = 'object.unknown',
}

const getTranslatedJoiMessage = ({
  message,
  type,
  context,
}: ValidationErrorItem): string => {
  const { label, limit, valids } = context as any;
  const errorType = type as JoiValidationErrorType;

  const language = UserLanguage.getLanguage();
  if (language === LanguagesConstants.ENGLISH) return message;

  const joiErrorMessages = {
    [LanguagesConstants.PORTUGUESE]: {
      'string.base': `"${label}" deve ser um texto`,
      'string.email': `"${label}" deve ser um e-mail válido`,
      'string.min': `"${label}" deve ter pelo menos ${limit} caracteres`,
      'string.guid': `"${label}" deve ser um UUID válido`,
      'string.empty': `"${label}" não pode ser vazio`,
      'number.base': `"${label}" deve ser um número`,
      'number.min': `"${label}" deve ser maior ou igual a ${limit}`,
      'number.max': `"${label}" deve ser menor ou igual a ${limit}`,
      'boolean.base': `"${label}" deve ser um booleano`,
      'any.only': `"${label}" só pode ser [${valids?.join(', ')}]`,
      'any.required': `"${label}" é obrigatório`,
      'object.unknown': `"${label}" não é permitido`,
    },
  };

  if (Object.values(JoiValidationErrorType).includes(errorType)) {
    return joiErrorMessages[language][errorType];
  }

  return message;
};

export { JoiValidationErrorType, getTranslatedJoiMessage };
