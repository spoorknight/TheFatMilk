# IMPLEMENTATION PLAN: M-AUTH (Auth & Users)

**Kịch bản:** Scenario 1 - Greenfield
**Module:** M-AUTH
**Đầu ra (Output):** `src/modules/auth/` và `src/core/`
**Quy tắc:** Chia nhỏ task đến mức class/file để AG-03 dễ dàng follow mà không bị mất bối cảnh. KHÔNG code gộp.

---

## 1. Mục tiêu
Xây dựng Core Boilerplate (Clean Architecture) và nghiệp vụ M-AUTH (Đăng ký, Đăng nhập, OTP, RBAC) theo đúng `API_Contracts.md` và `Database_Schema.md`.

---

## 2. Danh sách Task chi tiết

### Giai đoạn 1: Foundation (Core Boilerplate)
| Task ID | Component | Chi tiết công việc | File ảnh hưởng | Validation/Rules |
|---------|-----------|--------------------|----------------|------------------|
| S1-M1-T01 | Setup | Khởi tạo cấu trúc dự án: `src/core/`, `src/modules/`. | `src/core/config/env.ts`, `src/core/middlewares/error.middleware.ts` | Phải hứng toàn bộ Error và parse ra chuẩn `{ success: false, code, message }`. |
| S1-M1-T02 | Setup DB | Khởi tạo `prisma/schema.prisma` với table `users`, `customer_tiers`, `otp_codes`. | `prisma/schema.prisma`, `src/core/database/prisma.service.ts` | Field `phone` UNIQUE, `is_deleted` default false. Có index `phone`, `role`. |
| S1-M1-T03 | Base Types | Tạo các custom error classes (`AppError`, `NotFoundError`, `UnauthorizedError`, `ValidationError`). | `src/core/errors/*.error.ts` | Tương ứng HTTP 400, 401, 403, 404. |

### Giai đoạn 2: Domain Layer (Core Business Rules)
| Task ID | Component | Chi tiết công việc | File ảnh hưởng | Validation/Rules |
|---------|-----------|--------------------|----------------|------------------|
| S1-M1-T04 | Entity | Viết `UserEntity`, `RoleEnum` (admin, staff, customer). | `src/modules/auth/domain/entities/user.entity.ts`, `role.enum.ts` | Không chứa logic Prisma/DB, thuần TypeScript class/interface. |
| S1-M1-T05 | Interface | Khai báo `IUserRepository` (findByPhone, create, update, findById). | `src/modules/auth/domain/repositories/user.repository.interface.ts` | Dùng UserEntity làm kiểu trả về. |
| S1-M1-T06 | Interface | Khai báo `ITokenService` (generate, verify) và `IOtpService` (send, verify). | `src/modules/auth/domain/services/token.service.interface.ts`, `otp.service.interface.ts` | Tách biệt domain và thư viện (jwt, twilio). |

### Giai đoạn 3: Infrastructure Layer (External Adapters)
| Task ID | Component | Chi tiết công việc | File ảnh hưởng | Validation/Rules |
|---------|-----------|--------------------|----------------|------------------|
| S1-M1-T07 | Repository | Implement `PrismaUserRepository` theo `IUserRepository`. | `src/modules/auth/infrastructure/repositories/prisma-user.repository.ts` | Map từ Prisma Model sang UserEntity. Query với `is_deleted = false`. |
| S1-M1-T08 | Service | Implement `JwtTokenService` dùng `jsonwebtoken`. | `src/modules/auth/infrastructure/services/jwt-token.service.ts` | Đọc secret từ ENV. Xử lý logic expires. |
| S1-M1-T09 | Service | Implement `MockOtpService` (fake gửi SMS) và lưu xuống `otp_codes` table bằng Prisma. | `src/modules/auth/infrastructure/services/mock-otp.service.ts` | Hash mã OTP hoặc lưu raw tùy bảo mật, set TTL (hết hạn sau 5 phút). |

### Giai đoạn 4: Application Layer (Use Cases)
*Input: DTOs -> Bắt validation -> Gọi Repository -> Trả về Entity/Primitive.*
| Task ID | Component | Chi tiết công việc | File ảnh hưởng | Validation/Rules |
|---------|-----------|--------------------|----------------|------------------|
| S1-M1-T10 | Use Case | Viết `RegisterUseCase`: Check phone dup -> Hash pass -> Lưu DB -> Gửi OTP. | `src/modules/auth/application/use-cases/register.usecase.ts` | Bắn `ERR_DUPLICATE` nếu phone tồn tại. Dùng bcryptjs. |
| S1-M1-T11 | Use Case | Viết `VerifyOtpUseCase`: Check OTP -> Đánh dấu phone verify -> Generate Access+Refresh Token. | `src/modules/auth/application/use-cases/verify-otp.usecase.ts` | Bắn `ERR_OTP_INVALID`. Trả về `{ user, access_token, refresh_token }`. |
| S1-M1-T12 | Use Case | Viết `LoginUseCase`: Lấy user by phone -> Check pass -> Generate Tokens. | `src/modules/auth/application/use-cases/login.usecase.ts` | Bắn `ERR_UNAUTHORIZED` nếu sai pass/phone. |
| S1-M1-T13 | Use Case | Viết `GetProfileUseCase` và `UpdateProfileUseCase` (tên, avatar_url). | `src/modules/auth/application/use-cases/profile.usecase.ts` | `GetProfileUseCase` không trả password_hash. |
| S1-M1-T14 | Use Case | Viết `ForgotPasswordUseCase` và `ResetPasswordUseCase`. | `src/modules/auth/application/use-cases/password.usecase.ts` | Forgot -> gửi OTP. Reset -> yêu cầu OTP đúng. |

### Giai đoạn 5: API / Presentation Layer (Controllers & Routes)
| Task ID | Component | Chi tiết công việc | File ảnh hưởng | Validation/Rules |
|---------|-----------|--------------------|----------------|------------------|
| S1-M1-T15 | Validation | Dùng Zod định nghĩa schema cho Register, Login, Verify, UpdateProfile. | `src/modules/auth/api/auth.schema.ts` | Check format SĐT Việt Nam, pass min 8 char. |
| S1-M1-T16 | Middleware | Viết `auth.middleware.ts` (kiểm tra Bearer token) và `role.middleware.ts`. | `src/core/middlewares/auth.middleware.ts` | Bắn `ERR_UNAUTHORIZED` hoặc `ERR_FORBIDDEN`. |
| S1-M1-T17 | Controller | Viết `AuthController` map endpoints: `/register`, `/verify-otp`, `/login`, `/refresh`. | `src/modules/auth/api/auth.controller.ts` | Chỉ bắt try-catch, wrap format `{ success, data, message }`. |
| S1-M1-T18 | Controller | Viết `AuthController` map endpoints: `/me` (GET/PUT), `/forgot-password`, `/reset-password`. | `src/modules/auth/api/auth.controller.ts` | Dùng `auth.middleware.ts` cho `/me`. |
| S1-M1-T19 | Router | Khai báo `auth.routes.ts` và nhúng vào `app.ts` root router. | `src/modules/auth/api/auth.routes.ts`, `src/app.ts` | Prefix là `/api/auth`. |

---

## 3. Dependency Check
- **Database:** Bảng `users` phải map đúng SQL DDL (có role, full_name, phone, tier_id).
- **API Contracts:** Output JSON của API Controller phải khớp 100% với tài liệu.
- **Tiêu chí hoàn thành (DoD):**
  - Mở terminal chạy `npx tsc --noEmit` KHÔNG CÓ LỖI.
  - Các dependency Injection (DI) phải được setup thủ công hoặc bằng thư viện (như `tsyringe` / `awilix`). Khuyến nghị setup DI Container trong `src/core/di.ts` để tiêm Repository vào Use Case.
