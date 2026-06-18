import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { env } from './core/config/env';
import { errorMiddleware } from './core/middlewares/error.middleware';
import { authRouter } from './modules/auth/api/auth.controller';
import { tierRouter } from './modules/auth/api/tier.controller';
import { branchRouter } from './modules/branch/api/branch.controller';
import { productRouter } from './modules/product/api/product.controller';

const app = express();

// Security middlewares
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: '*', // TODO: Update to restrict in production
    credentials: true,
  })
);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'The Fat Milk Backend is running.' });
});

// Static files
app.use(express.static(path.join(__dirname, '../public')));

// Module routes
app.use('/api/auth', authRouter);
app.use('/api/tiers', tierRouter);
app.use('/api/branches', branchRouter);
app.use('/api/products', productRouter);

// Global Error Handler (must be the last middleware)
app.use(errorMiddleware);

// Start server
if (require.main === module) {
  app.listen(env.PORT, () => {
    console.log(`🚀 Server is running on port ${env.PORT} in ${env.NODE_ENV} mode.`);
  });
}

export default app;
