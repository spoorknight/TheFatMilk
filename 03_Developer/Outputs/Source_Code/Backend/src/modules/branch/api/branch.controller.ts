import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../../../core/database/prisma.service';
import { PrismaBranchRepository } from '../infrastructure/repositories/prisma-branch.repository';
import { CreateBranchUseCase } from '../application/use-cases/create-branch.use-case';
import { GetAllBranchesUseCase } from '../application/use-cases/get-all-branches.use-case';
import { GetNearestBranchesUseCase } from '../application/use-cases/get-nearest-branches.use-case';
import { AuthMiddleware } from '../../../core/middlewares/auth.middleware';

export const branchRouter = Router();

const branchRepo = new PrismaBranchRepository(prisma);
const createBranchUC = new CreateBranchUseCase(branchRepo);
const getAllBranchesUC = new GetAllBranchesUseCase(branchRepo);
const getNearestBranchesUC = new GetNearestBranchesUseCase(branchRepo);
const authMiddleware = new AuthMiddleware();

const createBranchSchema = z.object({
  name: z.string().min(1, 'Tên chi nhánh là bắt buộc'),
  address: z.string().min(1, 'Địa chỉ là bắt buộc'),
  phone: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  isActive: z.boolean().optional(),
});

branchRouter.post(
  '/',
  authMiddleware.verifyToken,
  authMiddleware.requireRole(['admin']),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = createBranchSchema.parse(req.body);
      const branch = await createBranchUC.execute(data);
      res.status(201).json({ success: true, data: branch });
    } catch (error) {
      next(error);
    }
  }
);

branchRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isActive = req.query.isActive ? req.query.isActive === 'true' : undefined;
    const branches = await getAllBranchesUC.execute(isActive);
    res.status(200).json({ success: true, data: branches });
  } catch (error) {
    next(error);
  }
});

branchRouter.get('/nearest', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);
    const limit = req.query.limit ? Number(req.query.limit) : 5;

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ success: false, message: 'lat and lng must be valid numbers' });
    }

    const branches = await getNearestBranchesUC.execute(lat, lng, limit);
    res.status(200).json({ success: true, data: branches });
  } catch (error) {
    next(error);
  }
});
