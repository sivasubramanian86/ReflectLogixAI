import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth';

export interface AuditEvent {
  id: string;
  timestamp: number;
  userId: string;
  action: string;
  resource: string;
  status: 'SUCCESS' | 'DENIED' | 'ERROR';
  ipMasked: string;
}

export const auditLogs: AuditEvent[] = [];

export function auditLogger(actionName: string) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    const event: AuditEvent = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
      userId: req.user?.userId || 'anonymous',
      action: actionName,
      resource: req.originalUrl,
      status: 'SUCCESS',
      ipMasked: '10.128.0.xxx'
    };
    auditLogs.unshift(event);
    if (auditLogs.length > 500) auditLogs.pop();
    next();
  };
}
