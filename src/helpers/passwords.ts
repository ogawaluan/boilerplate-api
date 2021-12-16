import { hash, verify } from 'argon2';

export const generateHash = async (stringToHash: string): Promise<string> => {
  return hash(stringToHash);
};

export const compareHashs = async (
  hashedString: string | undefined,
  nonHashedString: string
): Promise<boolean> => {
  if (!hashedString) return false;

  return verify(hashedString, nonHashedString);
};
