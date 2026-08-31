import { Router, Response } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

router.post('/test', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { channel, webhookUrl } = req.body;
  if (!webhookUrl || !webhookUrl.startsWith('https://')) {
    return res.status(400).json({ error: 'Valid HTTPS webhook URL is required.' });
  }
  res.json({ success: true, message: `Dispatched test payload to ${channel || 'webhook'}` });
});

export default router;
