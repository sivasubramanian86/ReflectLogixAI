import { Request, Response, NextFunction } from 'express';

export interface AuthenticatedUser {
  userId: string;
  email: string;
  displayName: string;
  role: 'user' | 'admin';
  longTermProfile?: {
    preferredLanguage?: string;
    bilingualOutput?: boolean;
    communicationStyle?: string;
  };
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const devUserId = (req.headers['x-user-id'] as string) || 'usr_kailasam_prod_01';

  req.user = {
    userId: devUserId,
    email: 'kailasamsiva@gmail.com',
    displayName: 'Kailasam Siva',
    role: devUserId.includes('admin') ? 'admin' : 'user',
    longTermProfile: {
      preferredLanguage: 'English',
      bilingualOutput: false,
      communicationStyle: 'Empathetic & Socratic'
    }
  };

  next();
}

export function requireAdminRole(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      error: 'Access Denied: Administrator role privileges are required.'
    });
  }
  next();
}
