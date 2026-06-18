import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../../core/database/prisma.service';

export const tierRouter = Router();

// GET /api/tiers — Public: lấy danh sách hạng thành viên
tierRouter.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const tiers = await prisma.customerTier.findMany({
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        minSpent: true,
        maintainSpent: true,
        discountPercent: true,
        sortOrder: true,
      },
    });

    // Convert BigInt to string for JSON serialization
    const data = tiers.map((t) => ({
      ...t,
      min_spent: t.minSpent.toString(),
      maintain_spent: t.maintainSpent.toString(),
      discount_percent: t.discountPercent.toString(),
      minSpent: undefined,
      maintainSpent: undefined,
      discountPercent: undefined,
      sortOrder: undefined,
    }));

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
});
