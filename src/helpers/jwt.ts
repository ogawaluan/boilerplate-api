import { sign, verify } from 'jsonwebtoken';

import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/env';

interface ITokenPayload {
  sub: string;
  role: string;
}

export const generateToken = (userId: string, role: string): string => {
  const jwtOptions = {};

  if (JWT_EXPIRES_IN) {
    Object.assign(jwtOptions, { expiresIn: JWT_EXPIRES_IN });
  }

  return sign({ role }, JWT_SECRET, {
    subject: userId,
    ...jwtOptions,
  });
};

export const verifyToken = (token: string): ITokenPayload => {
  return verify(token, JWT_SECRET) as ITokenPayload;
};
