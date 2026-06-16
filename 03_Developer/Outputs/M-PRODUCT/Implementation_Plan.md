# IMPLEMENTATION PLAN: M-PRODUCT (Product Catalog)

**Kịch bản:** Scenario 1 - Greenfield
**Module:** M-PRODUCT
**Đầu ra (Output):** `src/modules/product/`

---

## 1. Mục tiêu
Quản lý Category, Product, Product Image (gallery), Combo Product. Hỗ trợ upload ảnh ra ổ cứng nội bộ (Local Disk `/uploads/`).

---

## 2. Danh sách Task chi tiết

### Giai đoạn 1: Domain & DB Layer
| Task ID | Component | Chi tiết công việc | File ảnh hưởng | Validation/Rules |
|---------|-----------|--------------------|----------------|------------------|
| S1-M3-T01 | Setup DB | Cập nhật `prisma/schema.prisma`: bảng `categories`, `products`, `product_images`, `combo_products`. | `prisma/schema.prisma` | Ràng buộc Foreign Key CASCADE khi xóa product. |
| S1-M3-T02 | Entity | Viết Domain Entities cho Category, Product, ProductImage. | `src/modules/product/domain/entities/*.entity.ts` | — |
| S1-M3-T03 | Interface | Khai báo `IProductRepository`, `ICategoryRepository`, `IFileStorageService`. | `src/modules/product/domain/repositories/*.interface.ts` | `IFileStorageService` phải có hàm `uploadFile(buffer, filename)`. |

### Giai đoạn 2: Infrastructure Layer
| Task ID | Component | Chi tiết công việc | File ảnh hưởng | Validation/Rules |
|---------|-----------|--------------------|----------------|------------------|
| S1-M3-T04 | Repository | Implement `PrismaCategoryRepository` và `PrismaProductRepository`. | `src/modules/product/infrastructure/repositories/*.repository.ts` | Query Product phải `include` (join) Categories và Images (có `is_primary=true`). |
| S1-M3-T05 | Storage | Implement `LocalFileStorageService` dùng `fs` để lưu file ảnh. | `src/modules/product/infrastructure/services/local-storage.service.ts` | Thư mục gốc là `/uploads/`. Tự động tạo folder nếu chưa có. |

### Giai đoạn 3: Application Layer (Use Cases)
| Task ID | Component | Chi tiết công việc | File ảnh hưởng | Validation/Rules |
|---------|-----------|--------------------|----------------|------------------|
| S1-M3-T06 | Use Case | Viết CRUD Category (Create, Update, GetList, Soft Delete). | `src/modules/product/application/use-cases/category.usecase.ts` | — |
| S1-M3-T07 | Use Case | Viết CRUD Product (Create, Update, GetList, Soft Delete). | `src/modules/product/application/use-cases/product.usecase.ts` | Kiểm tra tính duy nhất của SKU. |
| S1-M3-T08 | Use Case | Viết UploadProductImageUseCase. | `src/modules/product/application/use-cases/upload-image.usecase.ts` | Upload file -> tạo bản ghi `product_images`. Giới hạn định dạng JPG, PNG. |

### Giai đoạn 4: API / Presentation Layer
| Task ID | Component | Chi tiết công việc | File ảnh hưởng | Validation/Rules |
|---------|-----------|--------------------|----------------|------------------|
| S1-M3-T09 | Middleware | Cấu hình `multer` middleware để nhận multipart/form-data. | `src/core/middlewares/upload.middleware.ts` | Giới hạn file 5MB. |
| S1-M3-T10 | Controller | Viết `CategoryController` (`/api/categories/*`). | `src/modules/product/api/category.controller.ts` | Admin (Write), Public (Read). |
| S1-M3-T11 | Controller | Viết `ProductController` (`/api/products/*`) và Upload API. | `src/modules/product/api/product.controller.ts` | Admin (Write, Upload), Public (Read). |
| S1-M3-T12 | Router | Khai báo routes và nhúng vào `app.ts`. Static route cho `/uploads`. | `src/modules/product/api/*.routes.ts`, `src/app.ts` | Dùng `express.static` expose thư mục `/uploads`. |
