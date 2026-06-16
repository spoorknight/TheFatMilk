# Kế hoạch Triển khai Tường Minh & Toàn Diện (Parallel BE & FE)

Bản kế hoạch này đảm bảo tham chiếu chéo 100% với **Requirements_Spec.md**, **Database_Schema.md**, và **Module_Breakdown.md**. Mỗi task không chỉ quy định rõ tên file/logic mà còn mapping trực tiếp với các mã yêu cầu (Ví dụ: `[REQ-F-001]`).

---

### MODULE 0: FOUNDATION (Thiết lập Nền tảng)

#### Backend Foundation
- [x] **M0-BE-01:** Khởi tạo thư mục `Backend`, chạy `npm init`, cài đặt các package cơ bản (express, typescript, dotenv, zod) và setup `tsconfig.json`.
- [ ] **M0-BE-02:** Tạo file `.env` mẫu và `src/core/config/env.ts` dùng Zod parse/validate biến môi trường.
- [ ] **M0-BE-03:** Viết Custom Error classes (`app.error.ts`).
- [ ] **M0-BE-04:** Viết Global Error Middleware (`error.middleware.ts`).
- [ ] **M0-BE-05:** Viết file `app.ts` (Entry point) gắn CORS, Helmet, JSON Parser và Error Middleware. Khai báo script `dev` bằng Nodemon.
- [ ] **M0-BE-06:** Tạo `docker-compose.yml` định nghĩa PostgreSQL 16 và Redis 7.
- [ ] **M0-BE-07:** Cài đặt Prisma và chạy `npx prisma init`.
- [ ] **M0-BE-08:** Khai báo file `prisma.service.ts` quản lý connection.

#### Frontend Foundation
- [ ] **M0-FE-01:** Khởi tạo thư mục `Frontend` bằng `npx create-next-app@14` (App Router, Tailwind CSS, TypeScript).
- [ ] **M0-FE-02:** Cài đặt `shadcn-ui`, cấu hình `components.json`, `tailwind.config.ts`.
- [ ] **M0-FE-03:** Setup PWA config (`manifest.json`, icon 1024x1024) [REQ-F-001].
- [ ] **M0-FE-04:** Tạo layout root chia route: `/(pwa)/`, `/admin/`, `/pos/`. Thiết lập Header cố định và Bottom Navigation [REQ-F-004, REQ-F-011].
- [ ] **M0-FE-05:** Khởi tạo `api-client.ts` (Axios) và cấu hình Zustand Global Store. Tích hợp Service Workers cơ bản [REQ-F-003].

---

### MODULE 1: M-AUTH (Tài khoản & Xác thực)

#### Backend
- [ ] **M1-BE-DB-01:** Định nghĩa schema `users`, `customer_tiers`, `otp_codes`, `branches`, `staff_branches` vào `schema.prisma`. Migrate DB.
- [ ] **M1-BE-DM-01:** Định nghĩa `RoleEnum` (Admin, Staff, Customer) [REQ-F-052] và `UserEntity`.
- [ ] **M1-BE-IF-01:** Code `BcryptPasswordService` (hash pass) [REQ-NF-002].
- [ ] **M1-BE-IF-02:** Code `JwtTokenService` và `DbOtpService` (TTL 5 phút).
- [ ] **M1-BE-IF-03:** Code `PrismaUserRepository`.
- [ ] **M1-BE-UC-01:** Code `RegisterUseCase`: Đăng ký SĐT + sinh OTP [REQ-F-051].
- [ ] **M1-BE-UC-02:** Code `VerifyOtpUseCase`: Xác thực OTP -> Cấp Access/Refresh Token.
- [ ] **M1-BE-UC-03:** Code `LoginUseCase` và `ForgotPasswordUseCase` (Quên mật khẩu qua OTP) [REQ-F-051].
- [ ] **M1-BE-API-01:** Viết Zod Schema và `AuthController`.
- [ ] **M1-BE-API-02:** Viết `AuthMiddleware` (Token verification) [REQ-NF-003].

#### Frontend
- [ ] **M1-FE-01:** PWA - Code LoginForm, RegisterForm, OtpInputForm (`/auth/login`).
- [ ] **M1-FE-02:** PWA - Code Trang Cá Nhân (`/profile`): Hiển thị Ảnh đại diện, Tên, Hạng thành viên + Progress bar tiến trình thăng hạng [REQ-F-014].
- [ ] **M1-FE-03:** Admin/POS - Màn hình Login riêng biệt cho Staff/Admin. Phân quyền Guard Route chặn URL.

---

### MODULE 2: M-BRANCH & M-PRODUCT (Chi nhánh & Sản phẩm)

#### Backend
- [ ] **M2-BE-DB-01:** Thêm schema `categories`, `products` (kèm cờ `is_seasonal`), `allergens`, `product_gallery` vào Prisma.
- [ ] **M2-BE-IF-01:** Code `PrismaBranchRepository` và `PrismaProductRepository`.
- [ ] **M2-BE-IF-02:** Code `LocalFileStorageService` (Upload ảnh nhiều file) [REQ-F-035].
- [ ] **M2-BE-UC-01:** Code UseCases `Branch`: CRUD chi nhánh [REQ-F-034], Tìm chi nhánh gần nhất bằng Geolocation [REQ-F-005].
- [ ] **M2-BE-UC-02:** Code UseCases `Category` & `Product`: Tạo SP kèm thông số F&B (trọng lượng, allergens, HSD, bảo quản) [REQ-F-035], tạo Combo/Bundle [REQ-F-037], upload Gallery.
- [ ] **M2-BE-API-01:** Controller & Router.

#### Frontend
- [ ] **M2-FE-01:** Admin - Form tạo Chi nhánh [REQ-F-034].
- [ ] **M2-FE-02:** Admin - Form tạo Sản phẩm đa nhiệm (kèm checkbox Allergens, up nhiều ảnh, is_seasonal) [REQ-F-035, REQ-F-036].
- [ ] **M2-FE-03:** PWA - Trang chủ (Banner Slider, Icon danh mục, Thẻ VIP Quick View) [REQ-F-006, 007, 009].
- [ ] **M2-FE-04:** PWA - Danh mục và Lưới sản phẩm 2 cột. Tính giá đã trừ chiết khấu cá nhân (theo hạng) ngay trên danh sách [REQ-F-010, REQ-F-021].
- [ ] **M2-FE-05:** PWA - Trang Chi tiết SP: Hiển thị Gallery, thuộc tính Allergens, Topping.

---

### MODULE 3: M-INVENTORY (Kho & Tồn kho)

#### Backend
- [ ] **M3-BE-DB-01:** Thêm schema `inventory` (theo branch_id), `inventory_logs`, `stock_transfers`.
- [ ] **M3-BE-IF-01:** Code `PrismaInventoryRepository`.
- [ ] **M3-BE-UC-01:** UseCases Inventory: Ghi nhận Nhập/Xuất kho, lấy tồn kho theo chi nhánh [REQ-F-038].
- [ ] **M3-BE-UC-02:** UseCases Transfer: Tạo Phiếu chuyển kho, Duyệt/Từ chối [REQ-F-039].
- [ ] **M3-BE-API-01:** Controller & Router.

#### Frontend
- [ ] **M3-FE-01:** Admin - Bảng Tồn kho (filter theo Branch).
- [ ] **M3-FE-02:** Admin - Modal Form Nhập/Xuất kho thủ công (lý do hỏng, nhập hàng).
- [ ] **M3-FE-03:** Admin - Màn hình Quản lý Phiếu chuyển kho.

---

### MODULE 4: M-ORDER & POS (Bán hàng & Đặt hàng)

#### Backend
- [ ] **M4-BE-DB-01:** Schema `orders` (tính tiền chi tiết: subtotal, tier_discount, voucher, points), `order_items`, `payments`.
- [ ] **M4-BE-IF-01:** `PrismaOrderRepository`: Code **DB Transaction + Row-level Locking** (`FOR UPDATE`) cực kỳ an toàn để trừ tồn kho chống over-selling [REQ-F-057].
- [ ] **M4-BE-IF-02:** `SePayPaymentService`: Generate QR động & Webhook Verify Signature [REQ-F-027, REQ-NF-004].
- [ ] **M4-BE-UC-01:** `CreateOrderUseCase`: Logic trừ voucher, trừ điểm, giảm giá hạng [REQ-F-056].
- [ ] **M4-BE-UC-02:** `ProcessPaymentWebhookUseCase`: Gạch nợ tự động đơn hàng SePay.
- [ ] **M4-BE-UC-03:** `UpdateOrderStatusUseCase`: Chờ duyệt -> Bếp làm -> Đã giao.
- [ ] **M4-BE-API-01:** `OrderController` & `WebhookController`.

#### Frontend
- [ ] **M4-FE-01:** PWA - Trang Giỏ hàng: Ghi chú "ít đường", "thêm đá" [REQ-F-024], nhập địa chỉ nhận hàng/Pick-up [REQ-F-059].
- [ ] **M4-FE-02:** PWA - Trang Thanh toán: Áp dụng Điểm [REQ-F-023], hiển thị QR SePay thanh toán [REQ-F-027].
- [ ] **M4-FE-03:** PWA - Lịch sử Đơn hàng (Bộ lọc trạng thái) [REQ-F-018].
- [ ] **M4-FE-04:** POS - Layout màn hình Máy tính tiền: Cột Barcode Scan bên trái [REQ-F-029], Hóa đơn bên phải. Tra cứu KH bằng SĐT [REQ-F-030].
- [ ] **M4-FE-05:** POS - Tích hợp UI in hóa đơn nhiệt [REQ-F-033].

---

### MODULE 5: M-CRM, WALLET & PROMO (Ví, Hạng, Khuyến mãi)

#### Backend
- [ ] **M5-BE-DB-01:** Schema `wallets`, `wallet_transactions`, `vouchers`, `flash_sales`, `points_ledger`.
- [ ] **M5-BE-IF-01:** `PrismaWalletRepository`: Code Transaction + Row-Level Lock để nạp/trừ tiền ví không bị âm [REQ-F-058, REQ-NF-009].
- [ ] **M5-BE-UC-01:** `EvaluateTierUseCase`: Chạy ngầm cộng dồn `total_spent` và tự động thăng hạng / cập nhật `% chiết khấu` [REQ-F-042, REQ-F-053].
- [ ] **M5-BE-UC-02:** `CalculatePointsUseCase`: Logic tích lũy 10đ/100K [REQ-F-054].
- [ ] **M5-BE-UC-03:** `TopupWalletUseCase`: Nạp ví qua Webhook SePay [REQ-F-016].
- [ ] **M5-BE-UC-04:** `ApplyVoucherUseCase` & Logic tính thời gian đếm ngược Flash Sale [REQ-F-046].
- [ ] **M5-BE-API-01:** Controller & Router cho CRM/Vouchers.

#### Frontend
- [ ] **M5-FE-01:** PWA - Trang Ví Tiền: Nút "Nạp tiền" bật QR SePay định danh [REQ-F-015].
- [ ] **M5-FE-02:** PWA - Thẻ Thành Viên: Lịch sử tích điểm, QR Code định danh KH cho POS [REQ-F-017].
- [ ] **M5-FE-03:** PWA - Component Đếm ngược Flash Sale ở Trang Chủ [REQ-F-008].
- [ ] **M5-FE-04:** Admin - Màn hình Cấu hình Hạng (Bronze/Silver/Gold) [REQ-F-041] và Tạo Voucher (Phạm vi chi nhánh/hạng KH) [REQ-F-045].
- [ ] **M5-FE-05:** Admin - Dashboard Báo cáo Doanh thu (Chart) & Báo cáo Ví tổng để đối soát tài chính [REQ-F-047, REQ-F-049].
