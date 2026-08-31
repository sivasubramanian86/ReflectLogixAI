import { Router, Response } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

router.get('/', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  res.json({
    journals: [],
    userId: req.user?.userId
  });
});

export default router;
