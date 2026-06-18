import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import multer from 'multer';
import { prisma } from '../../../core/database/prisma.service';
import { PrismaProductRepository } from '../infrastructure/repositories/prisma-product.repository';
import { CreateProductUseCase } from '../application/use-cases/create-product.use-case';
import { GetAllProductsUseCase } from '../application/use-cases/get-all-products.use-case';
import { GetProductBySlugUseCase } from '../application/use-cases/get-product-by-slug.use-case';
import { LocalFileStorageService } from '../../../core/storage/local-file-storage.service';
import { AuthMiddleware } from '../../../core/middlewares/auth.middleware';

export const productRouter = Router();

const productRepo = new PrismaProductRepository(prisma);
const createProductUC = new CreateProductUseCase(productRepo);
const getAllProductsUC = new GetAllProductsUseCase(productRepo);
const getProductBySlugUC = new GetProductBySlugUseCase(productRepo);
const fileStorage = new LocalFileStorageService();
const authMiddleware = new AuthMiddleware();

// Use memory storage for multer since we pass buffer to our storage service
const upload = multer({ storage: multer.memoryStorage() });

const createProductSchema = z.object({
  categoryId: z.string().uuid(),
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  sku: z.string().min(1),
  costPrice: z.coerce.number().min(0),
  sellingPrice: z.coerce.number().min(0),
  weight: z.string().optional(),
  ingredients: z.string().optional(),
  allergens: z.string().optional(),
  expiryDays: z.coerce.number().optional(),
  storageTemp: z.string().optional(),
  isCombo: z.coerce.boolean().optional(),
  comboPrice: z.coerce.number().optional(),
  isSeasonal: z.coerce.boolean().optional(),
  seasonalStart: z.coerce.date().optional(),
  seasonalEnd: z.coerce.date().optional(),
  isActive: z.coerce.boolean().optional(),
  comboItems: z.string().optional(), // Expected JSON string array
});

productRouter.post(
  '/',
  authMiddleware.verifyToken,
  authMiddleware.requireRole(['admin']),
  upload.array('gallery', 5), // Max 5 images
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = createProductSchema.parse(req.body);
      const files = req.files as Express.Multer.File[];

      // Upload files
      let uploadedImages: { url: string; isPrimary: boolean; sortOrder: number }[] = [];
      if (files && files.length > 0) {
        const fileUrls = await fileStorage.uploadMultipleFiles(files, 'products');
        uploadedImages = fileUrls.map((url, index) => ({
          url,
          isPrimary: index === 0,
          sortOrder: index,
        }));
      }

      let parsedComboItems = [];
      if (data.comboItems) {
        try {
          parsedComboItems = JSON.parse(data.comboItems);
        } catch (e) {
          // ignore
        }
      }

      const product = await createProductUC.execute({
        ...data,
        images: uploadedImages,
        comboItems: parsedComboItems,
      });

      res.status(201).json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  }
);

productRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categoryId = req.query.categoryId as string;
    const isSeasonal = req.query.isSeasonal ? req.query.isSeasonal === 'true' : undefined;
    const isActive = req.query.isActive ? req.query.isActive === 'true' : undefined;

    const products = await getAllProductsUC.execute({ categoryId, isSeasonal, isActive });
    
    // Serialize BigInt for JSON response
    const data = products.map((p: any) => ({
      ...p,
      costPrice: p.costPrice.toString(),
      sellingPrice: p.sellingPrice.toString(),
      comboPrice: p.comboPrice?.toString(),
    }));

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

productRouter.get('/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await getProductBySlugUC.execute(req.params.slug);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại' });
    }

    const p = product as any;
    const data = {
      ...p,
      costPrice: p.costPrice.toString(),
      sellingPrice: p.sellingPrice.toString(),
      comboPrice: p.comboPrice?.toString(),
    };

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
});
