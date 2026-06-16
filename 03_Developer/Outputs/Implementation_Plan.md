# Kế hoạch Triển khai Chi tiết Toàn Bộ (Granular Parallel Plan)

Bản kế hoạch này phân rã công việc đến mức độ **từng File/Logic đơn lẻ** cho TẤT CẢ 5 MODULE. Mỗi task được thực thi cực kỳ tinh gọn, giúp đảm bảo không bị mơ hồ.

---

### MODULE 0: FOUNDATION (Thiết lập Nền tảng)

#### Backend Foundation
- [ ] **M0-BE-01:** Khởi tạo thư mục `Backend`, chạy `npm init`, cài đặt các package cơ bản (express, typescript, dotenv, zod) và setup `tsconfig.json`.
- [ ] **M0-BE-02:** Tạo file `.env` mẫu và `src/core/config/env.ts` dùng Zod để parse và validate biến môi trường.
- [ ] **M0-BE-03:** Viết các Custom Error classes (`src/core/errors/app.error.ts` - AppError, ValidationError...).
- [ ] **M0-BE-04:** Viết Global Error Middleware (`src/core/middlewares/error.middleware.ts`) bắt ZodError và AppError.
- [ ] **M0-BE-05:** Viết file `src/app.ts` (Entry point) gắn CORS, Helmet, JSON Parser và Error Middleware. Khai báo script `dev` bằng Nodemon.
- [ ] **M0-BE-06:** Tạo `docker-compose.yml` định nghĩa service PostgreSQL 16 và Redis 7. Khởi động Docker.
- [ ] **M0-BE-07:** Cài đặt Prisma (`npm install prisma @prisma/client`) và chạy `npx prisma init`.
- [ ] **M0-BE-08:** Khai báo file `src/core/database/prisma.service.ts` để khởi tạo kết nối Prisma tái sử dụng toàn cục.

#### Frontend Foundation
- [ ] **M0-FE-01:** Khởi tạo thư mục `Frontend` bằng `npx create-next-app@14` (App Router, Tailwind CSS, TypeScript). Dọn dẹp boilerplate.
- [ ] **M0-FE-02:** Cài đặt `shadcn-ui` và thiết lập cấu hình cơ bản (`components.json`, `tailwind.config.ts`).
- [ ] **M0-FE-03:** Tạo cấu trúc thư mục route: `src/app/(pwa)/`, `src/app/admin/`, `src/app/pos/`.
- [ ] **M0-FE-04:** Khởi tạo `src/lib/api-client.ts` sử dụng Axios, tích hợp Interceptors để đính kèm Token.
- [ ] **M0-FE-05:** Cài đặt Zustand (hoặc React Context) để quản lý Global State (Ví dụ: Auth Store).

---

### MODULE 1: M-AUTH (Tài khoản & Xác thực)

#### 1.1. Backend
- [ ] **M1-BE-DB-01:** Định nghĩa schema các bảng `users`, `customer_tiers`, `otp_codes`, `branches`, `staff_branches` vào `prisma/schema.prisma`. Chạy migrate.
- [ ] **M1-BE-DM-01:** Khai báo `RoleEnum` (`src/modules/auth/domain/enums/role.enum.ts`) và `UserEntity`.
- [ ] **M1-BE-DM-02:** Khai báo Interface: `IUserRepository`, `ITokenService`, `IOtpService`, `IPasswordService`.
- [ ] **M1-BE-IF-01:** Code `BcryptPasswordService` (hash/compare password).
- [ ] **M1-BE-IF-02:** Code `JwtTokenService` (sign/verify Token).
- [ ] **M1-BE-IF-03:** Code `DbOtpService` (Sinh code, lưu DB có TTL, hàm verify).
- [ ] **M1-BE-IF-04:** Code `PrismaUserRepository` (Thao tác với Postgres).
- [ ] **M1-BE-UC-01:** Code `RegisterUseCase`: check trùng phone -> hash pass -> lưu DB -> gọi OTP Service.
- [ ] **M1-BE-UC-02:** Code `VerifyOtpUseCase`: check OTP hợp lệ -> đánh dấu user verified -> sinh Token.
- [ ] **M1-BE-UC-03:** Code `LoginUseCase` và `GetProfileUseCase`.
- [ ] **M1-BE-API-01:** Định nghĩa Zod Schema (`auth.schema.ts`) và viết `AuthController`.
- [ ] **M1-BE-API-02:** Viết `AuthMiddleware` (check Bearer) và `AuthRouter`.

#### 1.2. Frontend
- [ ] **M1-FE-01:** Tạo UI Component: LoginForm & RegisterForm, OtpInputForm (`src/components/auth/...`).
- [ ] **M1-FE-02:** Lắp ráp trang PWA Login/Register (`src/app/(pwa)/auth/login/page.tsx`). Gọi API auth.
- [ ] **M1-FE-03:** Viết logic Zustand lưu Access/Refresh Token sau login.
- [ ] **M1-FE-04:** Lắp ráp trang Admin Login (`src/app/admin/login/page.tsx`).
- [ ] **M1-FE-05:** Tạo Route Guard chặn chưa login vào `/admin`.

---

### MODULE 2: M-BRANCH & M-PRODUCT (Chi nhánh & Sản phẩm)

#### 2.1. Backend
- [ ] **M2-BE-DB-01:** Thêm schema `categories`, `products`, `product_gallery` vào Prisma. Chạy migrate.
- [ ] **M2-BE-DM-01:** Entities & Interfaces: `Branch`, `Product`, `Category`, `IBranchRepository`, `IProductRepository`.
- [ ] **M2-BE-IF-01:** Code `PrismaBranchRepository` và `PrismaProductRepository`.
- [ ] **M2-BE-IF-02:** Code `LocalFileStorageService` (logic save ảnh vào disk `/uploads`).
- [ ] **M2-BE-UC-01:** Nhóm Branch UseCases: CreateBranch, GetBranches, FindNearestBranch (tính khoảng cách).
- [ ] **M2-BE-UC-02:** Nhóm Product UseCases: CreateCategory, CreateProduct, UploadProductImage.
- [ ] **M2-BE-API-01:** Viết Validation Schemas, Controller và Router cho `/branches` và `/products`. Cấu hình Middleware phục vụ static file ảnh.

#### 2.2. Frontend
- [ ] **M2-FE-01:** UI Component: ProductCard, CategoryFilter, UploadButton, BranchSelector.
- [ ] **M2-FE-02:** Admin - Trang Quản lý Chi nhánh (Data Table CRUD).
- [ ] **M2-FE-03:** Admin - Trang Quản lý Sản phẩm (Data Table + Form Upload Ảnh).
- [ ] **M2-FE-04:** PWA - Trang chủ (Hiển thị Branch gần nhất, Menu SP phân loại theo Category).
- [ ] **M2-FE-05:** PWA - Trang Product Detail (Image Carousel, Topping selection form).

---

### MODULE 3: M-INVENTORY (Kho & Tồn kho)

#### 3.1. Backend
- [ ] **M3-BE-DB-01:** Thêm schema `inventory`, `inventory_logs`, `stock_transfers` vào Prisma. Chạy migrate.
- [ ] **M3-BE-DM-01:** Entities & Interfaces: `Inventory`, `IInventoryRepository`.
- [ ] **M3-BE-IF-01:** Code `PrismaInventoryRepository`.
- [ ] **M3-BE-UC-01:** UseCase: `StockInUseCase` (nhập), `StockOutUseCase` (xuất).
- [ ] **M3-BE-UC-02:** UseCase: `CreateStockTransferUseCase` (chuyển kho).
- [ ] **M3-BE-API-01:** Controller & Router cho `/inventory` và `/inventory/transfers`.

#### 3.2. Frontend
- [ ] **M3-FE-01:** UI Component: InventoryStockTable.
- [ ] **M3-FE-02:** Admin - Màn hình theo dõi tồn kho theo chi nhánh.
- [ ] **M3-FE-03:** Admin - Modal Form Nhập/Xuất kho thủ công.
- [ ] **M3-FE-04:** Admin - Màn hình Quản lý Phiếu chuyển kho (Duyệt/Từ chối phiếu).

---

### MODULE 4: M-ORDER & POS (Bán hàng & Đặt hàng)

#### 4.1. Backend
- [ ] **M4-BE-DB-01:** Thêm schema `orders`, `order_items`, `payments` vào Prisma. Chạy migrate.
- [ ] **M4-BE-DM-01:** Order Entity (Tích hợp logic tính tổng tiền, thuế), `IOrderRepository`, `ISePayAdapter`.
- [ ] **M4-BE-IF-01:** Code `PrismaOrderRepository` (Tích hợp DB Transaction và Row-Level Lock để trừ tồn kho an toàn).
- [ ] **M4-BE-IF-02:** Code `SePayPaymentService` (Tạo QR, Validate webhook signature).
- [ ] **M4-BE-UC-01:** Code `CreateOrderUseCase` (từ PWA hoặc POS).
- [ ] **M4-BE-UC-02:** Code `ProcessPaymentWebhookUseCase` (Gạch nợ tự động).
- [ ] **M4-BE-UC-03:** Code `UpdateOrderStatusUseCase` (Pending -> Processing -> Completed).
- [ ] **M4-BE-API-01:** Controllers cho `/orders` và public webhook cho `/webhooks/sepay`.

#### 4.2. Frontend
- [ ] **M4-FE-01:** UI Component: CartDrawer, CheckoutSummary, SePayQRCodeModal.
- [ ] **M4-FE-02:** PWA - Quản lý Giỏ hàng (Zustand Global Store).
- [ ] **M4-FE-03:** PWA - Trang Checkout (Nhập địa chỉ/Pick-up) và xem Barcode/QR thanh toán.
- [ ] **M4-FE-04:** PWA - Lịch sử Đơn hàng và Real-time status.
- [ ] **M4-FE-05:** POS - Xây dựng Layout máy tính tiền POS (Bên trái: Lưới sản phẩm, Bên phải: Bill, Nhập SĐT khách tích điểm).
- [ ] **M4-FE-06:** POS - Màn hình Kanban Bếp (Kitchen Display System - nhận đơn, hoàn thành).

---

### MODULE 5: M-CRM & M-PROMO (Khách hàng, Ví, Hạng, Khuyến mãi)

#### 5.1. Backend
- [ ] **M5-BE-DB-01:** Thêm schema `wallets`, `wallet_transactions`, `vouchers`, `flash_sales` vào Prisma. Migrate.
- [ ] **M5-BE-DM-01:** Domain Logic: Quy tắc nâng hạng (Tier rules), tính điểm (Points logic).
- [ ] **M5-BE-UC-01:** UseCase: `CalculatePointsAndTierUseCase` (chạy nền hoặc sau khi đơn hoàn thành).
- [ ] **M5-BE-UC-02:** UseCase: `TopupWalletUseCase` (Nạp tiền ví qua SePay).
- [ ] **M5-BE-UC-03:** UseCase: `ApplyVoucherUseCase` (Validation điều kiện voucher).
- [ ] **M5-BE-API-01:** Controllers & Routers cho `/crm/wallet`, `/crm/vouchers`.

#### 5.2. Frontend
- [ ] **M5-FE-01:** PWA - Trang Hội Viên (Hiển thị thẻ thành viên QR code, lịch sử tích/tiêu điểm, thanh tiến trình thăng hạng).
- [ ] **M5-FE-02:** PWA - Giao diện Ví Tiền (Số dư, Nút Nạp tiền, Lịch sử giao dịch ví).
- [ ] **M5-FE-03:** PWA - Input áp dụng Mã Khuyến Mãi (Voucher) tích hợp vào trang Checkout.
- [ ] **M5-FE-04:** Admin - Form Tạo Voucher (Giảm %, Giảm tiền, Điều kiện áp dụng).

---
*End of Plan.*
