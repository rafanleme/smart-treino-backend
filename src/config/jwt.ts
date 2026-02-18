import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from './env';

export const signToken = (userId: number): string => {
  return jwt.sign({ userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as any,
  });
};

export const verifyToken = (token: string): { userId: number } => {
  return jwt.verify(token, env.JWT_SECRET) as { userId: number };
};
