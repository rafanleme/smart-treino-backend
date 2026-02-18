declare global {
  namespace Express {
    interface User {
      id: number;
      email: string;
      name: string;
      googleId: string | null;
      avatarUrl: string | null;
      emailVerifiedAt: Date | null;
      createdAt: Date;
      updatedAt: Date;
    }

    interface Request {
      user?: User;
    }
  }
}
