# IMPLEMENTATION PLAN: CHI TIẾT SPRINT 1 (FOUNDATION)

**Kịch bản:** Scenario 1 - Greenfield
**Agent:** AG-03 (Developer)
**Trạng thái:** Chờ PM phê duyệt
**Mô tả:** Bản kế hoạch siêu chi tiết chia đến từng file/class/use-case cho 5 Module cốt lõi của Sprint 1 (M-AUTH, M-BRANCH, M-PRODUCT, M-INVENTORY, M-CRM) theo kiến trúc Clean Architecture. 

---

## 1. MODULE M-AUTH (Auth & Users)
**Đầu ra (Output):** `src/modules/auth/` và `src/core/`

### Phase 1.1: Core Boilerplate & Database Schema
| Task ID | Lớp (Layer) | File tạo / chỉnh sửa | Hành động | Constraint |
|---------|-------------|----------------------|-----------|------------|
| **S1-M1-T00** | Infra | `docker-compose.yml`<br>`.env` | Thiết lập Docker Compose chạy PostgreSQL 16 và Redis 7. Khởi tạo DB vật lý. | Chạy `docker-compose up -d`. Đảm bảo connection string đúng trong `.env`. |
| **S1-M1-T01** | Core | `src/core/middlewares/error.middleware.ts`<br>`src/core/config/env.ts` | Khởi tạo Express app, cấu hình Zod Error parser. | Bắt toàn bộ lỗi, map với Error Codes ở `API_Contracts.md`. |
| **S1-M1-T02** | Core | `prisma/schema.prisma`<br>`src/core/database/prisma.ts` | Khởi tạo Prisma (`npx prisma init`). Định nghĩa bảng `users`, `otp_codes`, `customer_tiers`. Chạy DB Migrate (`npx prisma migrate dev`). | Field `phone` UNIQUE, `is_deleted` default false. |
| **S1-M1-T03** | Domain | `src/modules/auth/domain/entities/user.entity.ts`<br>`role.enum.ts` | Định nghĩa class UserEntity thuần túy không lệ thuộc DB. | — |

### Phase 1.2: Infrastructure & Use Cases
| Task ID | Lớp (Layer) | File tạo / chỉnh sửa | Hành động | Constraint |
|---------|-------------|----------------------|-----------|------------|
| **S1-M1-T04** | Infra | `src/modules/auth/infrastructure/repositories/prisma-user.repository.ts` | Implement `IUserRepository` thao tác với Prisma. | Loại bỏ is_deleted=true. |
| **S1-M1-T05** | Infra | `src/modules/auth/infrastructure/services/jwt-token.service.ts`<br>`mock-otp.service.ts` | Setup JWT Sign/Verify và Mock SMS. | Tách biệt domain và library. |
| **S1-M1-T06** | App | `src/modules/auth/application/use-cases/register.usecase.ts` | Nhận đầu vào -> Hash password -> Gửi OTP. | Bắn `ERR_DUPLICATE` nếu trùng SĐT. |
| **S1-M1-T07** | App | `src/modules/auth/application/use-cases/verify-otp.usecase.ts` | So khớp OTP, cấp Token. | Trả `{ user, access_token, refresh_token }`. |
| **S1-M1-T08** | App | `src/modules/auth/application/use-cases/login.usecase.ts` | So khớp password, cấp Token. | Bắn `ERR_UNAUTHORIZED` nếu sai. |
| **S1-M1-T09** | App | Use Cases: Get/Update Profile, Forgot/Reset Password. | Cập nhật thông tin cơ bản. | — |

### Phase 1.3: Presentation
| Task ID | Lớp (Layer) | File tạo / chỉnh sửa | Hành động | Constraint |
|---------|-------------|----------------------|-----------|------------|
| **S1-M1-T10** | API | `src/core/middlewares/auth.middleware.ts` | Decode token, nhét `req.user`. | Bắn `ERR_UNAUTHORIZED`. |
| **S1-M1-T11** | API | `src/modules/auth/api/auth.schema.ts`<br>`auth.controller.ts`<br>`auth.routes.ts` | Map endpoint HTTP POST/GET với Use Case. | Chỉ wrap `{ success, data, message }`. |

---

## 2. MODULE M-BRANCH (Branch Management)
**Đầu ra (Output):** `src/modules/branch/`

| Task ID | Lớp (Layer) | File tạo / chỉnh sửa | Hành động | Constraint |
|---------|-------------|----------------------|-----------|------------|
| **S1-M2-T01** | Domain & DB| `prisma/schema.prisma` | Bảng `branches` với lat/lng. Entity Branch. | Prisma Migrate. |
| **S1-M2-T02** | Infra | `src/modules/branch/infrastructure/repositories/...` | Implement `PrismaBranchRepository`. | Hàm `findNearest(lat, lng)`. |
| **S1-M2-T03** | App | `src/modules/branch/application/use-cases/...` | Use Cases: Create, Update, Delete, FindNearest. | Tính toán Haversine hoặc order by khoảng cách. |
| **S1-M2-T04** | API | `src/modules/branch/api/branch.controller.ts` | Bọc Validation, `auth.middleware`, check role Admin (cho Write). | Các API public GET cho phép truy cập. |

---

## 3. MODULE M-PRODUCT (Product Catalog)
**Đầu ra (Output):** `src/modules/product/`

| Task ID | Lớp (Layer) | File tạo / chỉnh sửa | Hành động | Constraint |
|---------|-------------|----------------------|-----------|------------|
| **S1-M3-T01** | DB | `prisma/schema.prisma` | Bảng `products`, `categories`, `product_images`, `combo_products`. | Ràng buộc Foreign Key CASCADE. |
| **S1-M3-T02** | Infra | `src/modules/product/infrastructure/services/local-storage.service.ts` | Upload file dùng `fs`. Ghi ra `root/uploads/`. | — |
| **S1-M3-T03** | App | `src/modules/product/application/use-cases/upload-image.usecase.ts` | Nhận buffer, ghi ra đĩa, tạo bản ghi `product_images`. | Giới hạn định dạng JPG, PNG. |
| **S1-M3-T04** | App | Use Cases cho CRUD Product và Category. | Query kèm (include) relationships. | Check SKU duy nhất. |
| **S1-M3-T05** | API | `src/modules/product/api/product.controller.ts`<br>`src/core/middlewares/upload.middleware.ts` | Setup `multer`. Map routes. | Mở `express.static('/uploads')` ở `app.ts`. |

---

## 4. MODULE M-INVENTORY (Inventory Control)
**Đầu ra (Output):** `src/modules/inventory/`

| Task ID | Lớp (Layer) | File tạo / chỉnh sửa | Hành động | Constraint |
|---------|-------------|----------------------|-----------|------------|
| **S1-M4-T01** | DB | `prisma/schema.prisma` | Bảng `inventory`, `inventory_logs`, `stock_transfers`. | Unique(product_id, branch_id). |
| **S1-M4-T02** | Infra | `src/modules/inventory/infrastructure/repositories/prisma-inventory.repository.ts` | Transaction Prisma: Update Inventory & Write Log cùng lúc. | **Cực kỳ quan trọng.** |
| **S1-M4-T03** | App | `src/modules/inventory/application/use-cases/adjust-stock.usecase.ts` | Gọi Transaction Repository phía trên. | Ko cho phép tồn < 0. |
| **S1-M4-T04** | App | `src/modules/inventory/application/use-cases/transfer.usecase.ts` | Trừ kho xuất, cộng kho nhập. | Trạng thái phiếu: pending -> completed. |
| **S1-M4-T05** | API | `src/modules/inventory/api/inventory.controller.ts` | Map routes. Check role Admin/Staff. | — |

---

## 5. MODULE M-CRM (CRM & Tiers)
**Đầu ra (Output):** `src/modules/crm/`

| Task ID | Lớp (Layer) | File tạo / chỉnh sửa | Hành động | Constraint |
|---------|-------------|----------------------|-----------|------------|
| **S1-M5-T01** | DB | `prisma/seed.ts` | Seed data Bronze, Silver, Gold, Diamond. | — |
| **S1-M5-T02** | App | `src/modules/crm/application/use-cases/evaluate-tier.usecase.ts` | So sánh `total_spent` của user hiện tại với list Tiers để thăng/xuống hạng. | Gọi Update User Repository. |
| **S1-M5-T03** | App | `src/modules/crm/application/use-cases/lookup.usecase.ts` | Trả về tổng quan User (Wallet, Point, Tier, Spent) cho POS. | — |
| **S1-M5-T04** | API | `src/modules/crm/api/crm.controller.ts` | Map endpoints (`/my-tier`, `/lookup`, `/evaluate`). | — |

---

## 6. Định nghĩa Done của 1 Task (Definition of Done)
1. **Cô lập:** Code chỉ thực thi duy nhất phần logic được chỉ định.
2. **Không lỗi (No Error):** Chạy lệnh `npx tsc --noEmit` không báo đỏ. Đã chạy Prisma Migration.
3. **Lưu lịch sử:** Báo cáo vào file `Changelog.md` sau khi hoàn tất.
4. **Clean Code:** Luôn luôn Type Hinting (TypeScript) đầy đủ. Không dùng `any`. Không bỏ business logic vào Controller.
