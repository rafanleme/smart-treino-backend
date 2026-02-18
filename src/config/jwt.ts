import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from './env';

export const signToken = (userId: number): string => {
  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN,
  };
  return jwt.sign({ userId }, env.JWT_SECRET, options);
};

export const verifyToken = (token: string): { userId: number } => {
  return jwt.verify(token, env.JWT_SECRET) as { userId: number };
};
