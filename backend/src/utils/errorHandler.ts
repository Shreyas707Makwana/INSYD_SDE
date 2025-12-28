import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ error: message });
}

export function badRequest(message: string) {
  const error = new Error(message) as any;
  error.status = 400;
  return error;
}

export function notFound(message: string) {
  const error = new Error(message) as any;
  error.status = 404;
  return error;
}
