import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import journalRouter from './routes/journal';
import insightsRouter from './routes/insights';
import notificationsRouter from './routes/notifications';
import adminRouter from './routes/admin';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: '@reflectlogixai/api',
    version: '3.1.0-cloudrun',
    timestamp: new Date().toISOString()
  });
});

// Modular Routes
app.use('/api/journals', journalRouter);
app.use('/api/insights', insightsRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/admin', adminRouter);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[ReflectLogixAI API] Service listening on port ${PORT}`);
  });
}

export default app;
