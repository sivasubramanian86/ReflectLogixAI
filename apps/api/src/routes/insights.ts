import { Router, Response } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

router.get('/trends', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  res.json({
    userId: req.user?.userId,
    averageStress: 3.2,
    positivityRatio: 0.78,
    activeStreakDays: 7
  });
});

export default router;
