import { Request, Response, NextFunction } from 'express';
import passport from '../config/passport';
import { UnauthorizedError } from '../utils/errors';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err: any, user: any) => {
    if (err) return next(err);
    if (!user) return next(new UnauthorizedError('Token inválido ou expirado'));

    req.user = user;
    next();
  })(req, res, next);
};
