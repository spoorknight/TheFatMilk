# Kế hoạch Triển khai Chi tiết (Granular Parallel Plan)

Bản kế hoạch này phân rã công việc đến mức độ **từng File/Logic đơn lẻ** nhằm đảm bảo mỗi task được thực thi cực kỳ tinh gọn, dễ dàng review và đối soát với tài liệu kỹ thuật.

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
**1.1.1. Database & Domain**
- [ ] **M1-BE-DB-01:** Định nghĩa schema các bảng `users`, `customer_tiers`, `otp_codes`, `branches`, `staff_branches` vào `prisma/schema.prisma`.
- [ ] **M1-BE-DB-02:** Chạy `npx prisma migrate dev` tạo CSDL thực tế.
- [ ] **M1-BE-DM-01:** Khai báo `RoleEnum` (`src/modules/auth/domain/enums/role.enum.ts`).
- [ ] **M1-BE-DM-02:** Viết lớp `UserEntity` tinh gọn độc lập nghiệp vụ (`src/modules/auth/domain/entities/user.entity.ts`).
- [ ] **M1-BE-DM-03:** Khai báo các Interface: `IUserRepository`, `ITokenService`, `IOtpService`, `IPasswordService`.

**1.1.2. Infrastructure (Thực thi Repo/Service)**
- [ ] **M1-BE-IF-01:** Code `BcryptPasswordService` (hash/compare password).
- [ ] **M1-BE-IF-02:** Code `JwtTokenService` (sign/verify Access & Refresh Token).
- [ ] **M1-BE-IF-03:** Code `DbOtpService` (Sinh code 6 số random, lưu xuống DB có TTL, hàm verify).
- [ ] **M1-BE-IF-04:** Code `PrismaUserRepository` (Thao tác với Postgres, map về Domain Entity).

**1.1.3. Application (Use Cases)**
- [ ] **M1-BE-UC-01:** Code `RegisterUseCase`: check trùng phone -> hash pass -> lưu DB -> gọi OTP Service.
- [ ] **M1-BE-UC-02:** Code `VerifyOtpUseCase`: check OTP hợp lệ -> đánh dấu user isVerified (hoặc active) -> sinh Token.
- [ ] **M1-BE-UC-03:** Code `LoginUseCase`: check phone -> check pass -> sinh Token.
- [ ] **M1-BE-UC-04:** Code `GetProfileUseCase` & `UpdateProfileUseCase`.

**1.1.4. API & Routers**
- [ ] **M1-BE-API-01:** Định nghĩa schema Zod Validate cho Register/Login Request (`src/modules/auth/api/auth.schema.ts`).
- [ ] **M1-BE-API-02:** Viết `AuthController` bọc lấy UseCases, trả về JSON chuẩn.
- [ ] **M1-BE-API-03:** Viết `AuthRouter` và đăng ký vào `app.ts`.
- [ ] **M1-BE-API-04:** Viết `AuthMiddleware` trích xuất Header Bearer Token -> gán `req.user`.

#### 1.2. Frontend (PWA & Admin)
- [ ] **M1-FE-01:** Tạo UI Component: LoginForm & RegisterForm (`src/components/auth/...`).
- [ ] **M1-FE-02:** Tạo UI Component: OtpInputForm.
- [ ] **M1-FE-03:** Lắp ráp trang PWA Login/Register (`src/app/(pwa)/auth/login/page.tsx`). Tích hợp gọi API `/api/auth/register` và `/api/auth/verify-otp`.
- [ ] **M1-FE-04:** Xử lý lưu Access/Refresh Token sau khi login thành công (Zustand + LocalStorage/Cookie). Redirect về Home.
- [ ] **M1-FE-05:** Lắp ráp trang Admin Login (`src/app/admin/login/page.tsx`).
- [ ] **M1-FE-06:** Tạo Provider bảo vệ Route (Route Guard): chặn khách vào `/admin`, chặn user chưa đăng nhập.

---

### Các Module tiếp theo (M2 - M5) sẽ được bổ sung chi tiết tương tự khi hoàn thành M0 & M1.
*(Tránh việc Plan quá dài trong 1 lần đọc, tập trung Focus vào Sprint đầu tiên)*
