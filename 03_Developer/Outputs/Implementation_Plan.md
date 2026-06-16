# BẢN KẾ HOẠCH TRIỂN KHAI (IMPLEMENTATION PLAN) - THE FAT MILK

**Kịch bản:** Scenario 1 - Greenfield (Xây dựng từ đầu)
**Agent:** AG-03 (Developer)
**Trạng thái:** Chờ PM phê duyệt

---

## 1. Tổng quan
Theo thiết kế từ AG-02, hệ thống The Fat Milk (Next.js + Node.js + PostgreSQL) được chia thành 16 Module độc lập.
Trong Sprint 1 và 2, AG-03 sẽ tập trung xây dựng toàn bộ **Boilerplate Clean Architecture** và triển khai 9 Module Backend cốt lõi phục vụ Foundation và Financial.

---

> [!IMPORTANT]
> ## User Review Required
> Vui lòng xác nhận cách thức tổ chức source code cho Backend:
> AG-03 sẽ chia source code theo Clean Architecture (chia thư mục theo từng module, ví dụ: `src/modules/auth/domain/`, `src/modules/auth/application/`, `src/modules/auth/infrastructure/`, `src/modules/auth/api/`). PM có đồng ý với cấu trúc `Module-first` này không?
> 
> Xin PM phê duyệt kế hoạch chi tiết cho các Module thuộc Sprint 1 & 2 để AG-03 bắt đầu bước vào Sprint 2 (Implementation).

## 2. Phạm vi công việc (Scope)

| In-scope | Out-of-scope |
|----------|--------------|
| Khởi tạo Boilerplate Node.js + Express + Prisma + TypeScript | Chưa code logic Frontend UI (PWA/POS/Admin) ở giai đoạn này. |
| Triển khai Sprint 1: M-AUTH, M-BRANCH, M-PRODUCT, M-INVENTORY, M-CRM | Tích hợp các SDK ngoại lai nằm ngoài API_Contracts. |
| Triển khai Sprint 2: M-WALLET, M-SEPAY, M-POINTS, M-VOUCHER | Triển khai Docker, CI/CD thực tế (Deploy). |

---

## 3. Danh sách Task chi tiết (Sprint 1 & Sprint 2)

### SPRINT 1 — FOUNDATION (BACKEND CORE)

#### Module: M-AUTH (Auth & Users)
| Task ID | Loại | Mô tả chi tiết | File output | Constraint |
|---------|------|----------------|-------------|------------|
| S1-M1-01 | Setup | Tạo thư mục Clean Architecture, Prisma Schema (`users` table), Error handling Middleware. | `src/core/`, `prisma/schema.prisma` | Boilerplate chuẩn. |
| S1-M1-02 | Domain | Entity User, Role Enum. | `src/modules/auth/domain/` | Không phụ thuộc DB. |
| S1-M1-03 | Infra | User Repository (Prisma), JWT Utility, OTP Adapter (mock/Firebase). | `src/modules/auth/infrastructure/` | Xử lý DB & Token. |
| S1-M1-04 | App | Use Cases: Đăng ký, Đăng nhập, Verify OTP, Refresh Token. | `src/modules/auth/application/` | Logic nghiệp vụ chính. |
| S1-M1-05 | API | Controller & Router: `/api/auth/*` | `src/modules/auth/api/` | Validation bằng Zod. |

#### Module: M-BRANCH (Branch Management)
| Task ID | Loại | Mô tả chi tiết | File output | Constraint |
|---------|------|----------------|-------------|------------|
| S1-M2-01 | Domain & DB | Entity Branch, Prisma Schema (`branches` table). | `src/modules/branch/domain/` | — |
| S1-M2-02 | App & Infra | Repository, Use Cases: CRUD Branch. | `src/modules/branch/application/` | — |
| S1-M2-03 | API | Controller & Router: `/api/branches/*` | `src/modules/branch/api/` | RBAC: Admin write. |

#### Module: M-PRODUCT (Product Catalog)
| Task ID | Loại | Mô tả chi tiết | File output | Constraint |
|---------|------|----------------|-------------|------------|
| S1-M3-01 | Domain & DB | Entity Category, Product, ProductImage, ComboProduct. | `src/modules/product/domain/` | — |
| S1-M3-02 | App & Infra | Repositories, Upload Image Adapter (Local Disk `/uploads/`), Use Cases: CRUD Product, CRUD Category. | `src/modules/product/application/` | Local file storage. |
| S1-M3-03 | API | Controller & Router: `/api/products/*`, `/api/categories/*` | `src/modules/product/api/` | Include allergens. |

#### Module: M-INVENTORY (Inventory Control)
| Task ID | Loại | Mô tả chi tiết | File output | Constraint |
|---------|------|----------------|-------------|------------|
| S1-M4-01 | Domain & DB | Entity Inventory, InventoryLogs, StockTransfers. | `src/modules/inventory/domain/` | — |
| S1-M4-02 | App & Infra | Repo, Use Cases: Update Stock, Get Logs, Transfer Stock. | `src/modules/inventory/application/` | Khóa kho (Transaction). |
| S1-M4-03 | API | Controller & Router: `/api/inventory/*` | `src/modules/inventory/api/` | RBAC: Admin & Staff. |

#### Module: M-CRM (CRM & Tiers)
| Task ID | Loại | Mô tả chi tiết | File output | Constraint |
|---------|------|----------------|-------------|------------|
| S1-M5-01 | Domain & DB | Entity CustomerTier. | `src/modules/crm/domain/` | — |
| S1-M5-02 | App & Infra | Use Cases: Update Tiers, Evalute Tier, POS Lookup. | `src/modules/crm/application/` | Logic tính tổng chi tiêu. |
| S1-M5-03 | API | Controller & Router: `/api/crm/*` | `src/modules/crm/api/` | Lookup = Read. |

---

### SPRINT 2 — FINANCIAL CORE

#### Module: M-WALLET (E-Wallet)
| Task ID | Loại | Mô tả chi tiết | File output | Constraint |
|---------|------|----------------|-------------|------------|
| S2-M6-01 | Domain & DB | Entity Wallet, WalletTransaction. | `src/modules/wallet/domain/` | Số dư `balance >= 0`. |
| S2-M6-02 | App & Infra | Use Cases: Topup, Deduct, Get Balance. DB Transaction Lock (`SELECT FOR UPDATE`). | `src/modules/wallet/application/` | Chống Race condition. |
| S2-M6-03 | API | Controller & Router: `/api/wallet/*` | `src/modules/wallet/api/` | Xác thực Idempotency. |

#### Module: M-SEPAY (SePay Integration)
| Task ID | Loại | Mô tả chi tiết | File output | Constraint |
|---------|------|----------------|-------------|------------|
| S2-M7-01 | App & Infra | SePayAdapter (HMAC verify), Webhook Handler (Giao tiếp với M-WALLET). | `src/modules/sepay/application/` | Payload signature. |
| S2-M7-02 | API | Controller & Router: `/api/webhook/sepay` | `src/modules/sepay/api/` | Phải trả về HTTP 200 OK ngay. |

*(Các module còn lại (Points, Voucher, Order, Delivery, Frontend...) sẽ được lập kế hoạch chi tiết trong đợt tiếp theo sau khi hoàn tất Sprint 2 Backend)*

---

## 4. Dependency Map

| Task | Phụ thuộc vào | Lý do |
|------|--------------|-------|
| M-BRANCH | M-AUTH | Dùng chung JWT auth middleware và DB connection. |
| M-PRODUCT | M-BRANCH, M-AUTH | Có ràng buộc RBAC Admin. |
| M-INVENTORY | M-PRODUCT, M-BRANCH | Cần Product và Branch tồn tại để ánh xạ tồn kho. |
| M-CRM | M-AUTH | Cập nhật Tier trực tiếp trên user (User Table). |
| M-WALLET | M-AUTH | Mỗi user có 1 ví. |
| M-SEPAY | M-WALLET | Webhook SePay cộng tiền trực tiếp vào M-WALLET. |

---

## 5. Định nghĩa Done (Definition of Done)

Task được coi là DONE khi:
- [ ] Code pass syntax check (TypeScript `tsc --noEmit`).
- [ ] Đã chạy Prisma Generate và Migration thành công.
- [ ] Error handling trả về đúng format chung của hệ thống.
- [ ] Không hardcode (sử dụng `.env`).
- [ ] `Changelog.md` trong từng thư mục xuất ra được cập nhật đầy đủ.
- [ ] Mọi API Endpoint phải map 100% với `API_Contracts.md`.

---
## 6. Lời kết
Kính gửi PM, vui lòng xem xét bản Implementation Plan này. Nếu PM Approve, AG-03 sẽ tiến hành **Task S1-M1-01** (Setup Boilerplate, M-AUTH).
