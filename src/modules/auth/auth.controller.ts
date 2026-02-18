import { Request, Response, NextFunction } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { signToken } from '../../config/jwt';
import { AuthService } from './auth.service';
import { googleAuthSchema, updateProfileSchema } from './auth.schemas';
import { env } from '../../config/env';
import prisma from '../../config/database';
import { UnauthorizedError } from '../../utils/errors';
import { transformUser } from '../../utils/transformers';

const authService = new AuthService();
const googleClient = new OAuth2Client(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET
);

export class AuthController {
  /**
   * GET /api/v1/auth/google/redirect
   * Get Google OAuth2 authorization URL
   */
  async googleRedirect(req: Request, res: Response) {
    // The redirect URI must match exactly what's configured in Google Cloud Console
    const redirectUri = `${env.FRONTEND_URL}/auth/callback`;

    const authUrl = googleClient.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
      ],
      redirect_uri: redirectUri,
    });

    res.json({
      data: {
        url: authUrl,
      },
    });
  }

  /**
   * POST /api/v1/auth/google
   * Authenticate with Google OAuth2 (receives code from frontend)
   */
  async googleAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const { code, redirectUri } = googleAuthSchema.parse(req.body);

      // Exchange code for tokens
      const { tokens } = await googleClient.getToken({
        code,
        redirect_uri: redirectUri,
      });

      if (!tokens.id_token) {
        throw new UnauthorizedError('No ID token received from Google');
      }

      // Verify ID token
      const ticket = await googleClient.verifyIdToken({
        idToken: tokens.id_token,
        audience: env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        throw new UnauthorizedError('Invalid Google token payload');
      }

      const { email, name, picture, sub: googleId } = payload;

      // Find or create user
      let user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        user = await prisma.user.create({
          data: {
            email,
            name: name || email.split('@')[0],
            googleId,
            avatarUrl: picture,
            emailVerifiedAt: new Date(),
          },
        });

        // Create user streak record
        await prisma.userStreak.create({
          data: { userId: user.id },
        });
      } else if (!user.googleId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            googleId,
            avatarUrl: picture,
            emailVerifiedAt: new Date(),
          },
        });
      }

      // Generate JWT
      const token = signToken(user.id);

      res.json({
        data: {
          access_token: token,
          token_type: 'bearer',
          expires_in: 3600,
          user: transformUser(user),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/auth/me
   * Get authenticated user profile
   */
  async me(req: Request, res: Response, next: NextFunction) {
    try {
      const profile = await authService.getUserProfile(req.user!.id);
      res.json({ data: profile });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v1/auth/me
   * Update authenticated user profile
   */
  async updateMe(req: Request, res: Response, next: NextFunction) {
    try {
      const data = updateProfileSchema.parse(req.body);
      const profile = await authService.updateProfile(req.user!.id, data);
      res.json({ data: profile });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/refresh
   * Refresh JWT token
   */
  async refresh(req: Request, res: Response) {
    const token = signToken(req.user!.id);
    res.json({
      data: {
        access_token: token,
        token_type: 'bearer',
        expires_in: 3600,
      },
    });
  }

  /**
   * POST /api/v1/auth/logout
   * Logout (client-side only, no server state)
   */
  async logout(req: Request, res: Response) {
    res.status(204).send();
  }
}
