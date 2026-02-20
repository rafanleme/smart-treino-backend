import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../utils/errors';
import prisma from '../config/database';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

/**
 * Refresh authentication middleware
 * Accepts recently expired JWT tokens (< 7 days) for token refresh
 */
export const refreshAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Token não fornecido'));
  }

  const token = authHeader.split(' ')[1];

  try {
    // Decode without verifying expiration
    const decoded = jwt.verify(token, env.JWT_SECRET, { ignoreExpiration: true }) as {
      userId: number;
      exp: number;
      iat: number;
    };

    // Validate that token hasn't expired too long ago (< 7 days)
    const exp = decoded.exp * 1000; // Convert to milliseconds
    const now = Date.now();
    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
    const timeSinceExpiry = now - exp;

    if (timeSinceExpiry > sevenDaysInMs) {
      return next(new UnauthorizedError('Token expirado há muito tempo'));
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return next(new UnauthorizedError('Usuário não encontrado'));
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new UnauthorizedError('Token inválido'));
    }
    return next(error);
  }
};
