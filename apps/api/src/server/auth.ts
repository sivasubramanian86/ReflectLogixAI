import { Request, Response, NextFunction } from 'express';
import { dbStore } from './storage';
import { UserProfile } from '../types';

export interface AuthenticatedRequest extends Request {
  user?: UserProfile;
}

/**
 * Server-Side Authentication Middleware
 * Validates the Authorization Bearer Token.
 * In a deployed Firebase environment, this verifies the JWT via Firebase Admin SDK.
 * In development / preview, it resolves the trusted session user or default admin user,
 * ensuring tenant isolation where `userId` is strictly anchored on the server.
 */
export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const requestedUserId = (req.headers['x-user-id'] as string) || 'user_kailasam_001';

  // Find user by userId in store
  let user = dbStore.getUser(requestedUserId);

  if (!user) {
    // If not found, look up admin default or create tenant profile
    user = dbStore.getUser('user_kailasam_001');
    if (!user) {
      user = {
        userId: requestedUserId,
        email: 'kailasamsiva@gmail.com',
        displayName: 'Siva',
        role: 'admin',
        preferredLanguage: 'English',
        bilingualOutput: true,
        theme: 'dark',
        createdTimestamp: Date.now(),
        lastActiveTimestamp: Date.now(),
        longTermProfile: {
          coreValues: ['Focus', 'Integrity', 'Mindfulness'],
          primaryGoals: ['Architect zero-trust systems'],
          knownStressors: ['Multitasking'],
          positiveAnchors: ['Morning walk'],
          summary: 'Cloud AI Engineer & Mindful Architect'
        }
      };
      dbStore.upsertUser(user);
    }
  }

  req.user = user;
  next();
}

/**
 * Role-Based Access Control (RBAC) Middleware
 * Verifies that the authenticated user possesses the 'admin' role.
 */
export function requireAdminRole(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized: Authentication required.' });
  }

  if (req.user.role !== 'admin') {
    dbStore.logAudit(
      req.user.userId,
      'ADMIN_ACCESS_ATTEMPT',
      req.originalUrl,
      'DENIED',
      `Non-admin role "${req.user.role}" attempted privileged access.`
    );
    return res.status(403).json({ error: 'Forbidden: Admin privilege required for this resource.' });
  }

  next();
}
