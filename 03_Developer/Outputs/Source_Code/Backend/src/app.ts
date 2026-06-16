import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './core/config/env';
import { errorMiddleware } from './core/middlewares/error.middleware';
import { NotFoundError } from './core/errors/app.error';

const app = express();

// Global Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: 'OK', timestamp: new Date() });
});

// 404 Handler
app.use((req: Request, res: Response, next) => {
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`));
});

// Global Error Handler
app.use(errorMiddleware);

const PORT = env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT} in ${env.NODE_ENV} mode`);
});

export default app;
