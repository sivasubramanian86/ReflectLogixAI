import { Router, Response } from 'express';
import { requireAuth, requireAdminRole, AuthenticatedRequest } from '../middleware/auth';
import { auditLogs } from '../middleware/audit';

const router = Router();

router.get('/metrics', requireAuth, requireAdminRole, (_req: AuthenticatedRequest, res: Response) => {
  res.json({
    totalUsers: 142,
    totalJournalsAnalyzed: 1890,
    averageLatencyMs: 380,
    auditLogs
  });
});

export default router;
